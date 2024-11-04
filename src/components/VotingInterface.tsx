import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { storeVote, getVoteCounts, retrieveCredential } from '../services/pinata';
import { Proposal } from '../types';
import VoteStats from './VoteStats';

const proposals: Proposal[] = [
  {
    id: 1,
    title: 'Community Treasury Allocation',
    description: 'Allocate 1000 tokens to community development initiatives',
    deadline: '2024-11-20',
  },
  {
    id: 2,
    title: 'Protocol Upgrade Proposal',
    description: 'Implement new security features in the next protocol version',
    deadline: '2024-12-25',
  },
];

export default function VotingInterface() {
  const [votes, setVotes] = useState<Record<number, 'yes' | 'no'>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, string>>({});
  const [proposalsWithCounts, setProposalsWithCounts] = useState<Proposal[]>(proposals);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const updatedProposals = await Promise.all(
          proposals.map(async (proposal) => {
            try {
              const counts = await getVoteCounts(proposal.id);
              return { 
                ...proposal, 
                voteCount: counts
              };
            } catch (error) {
              console.error(`Error fetching data for proposal ${proposal.id}:`, error);
              return proposal;
            }
          })
        );
        setProposalsWithCounts(updatedProposals);
      } catch (error) {
        console.error('Error fetching vote counts:', error);
      }
    };

    fetchVoteCounts();
    const interval = setInterval(fetchVoteCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (proposalId: number, vote: 'yes' | 'no') => {
    setVotes(prev => ({ ...prev, [proposalId]: vote }));
    setError(prev => ({ ...prev, [proposalId]: '' }));
  };

  const handleSubmit = async (proposalId: number) => {
    setLoading(prev => ({ ...prev, [proposalId]: true }));
    setError(prev => ({ ...prev, [proposalId]: '' }));

    try {
      const address = localStorage.getItem('userAddress') || 
        ('0x' + Math.random().toString(16).slice(2, 42));
      const credential = await retrieveCredential(address);
      
      if (!credential) {
        throw new Error('No valid credential found');
      }

      await storeVote(proposalId, votes[proposalId], credential);
      
      // Update vote counts
      const newCounts = await getVoteCounts(proposalId);
      setProposalsWithCounts(prev => 
        prev.map(p => 
          p.id === proposalId 
            ? { ...p, voteCount: newCounts }
            : p
        )
      );

      // Clear the vote selection
      setVotes(prev => {
        const newVotes = { ...prev };
        delete newVotes[proposalId];
        return newVotes;
      });
    } catch (err) {
      setError(prev => ({
        ...prev,
        [proposalId]: err instanceof Error ? err.message : 'Failed to submit vote. Please try again.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const isExpired = (deadline: string) => new Date(deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Active Proposals</h2>
      
      <div className="space-y-6">
        {proposalsWithCounts.map(proposal => (
          <div
            key={proposal.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {proposal.title}
                  </h3>
                  {isExpired(proposal.deadline) && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{proposal.description}</p>
              </div>
              <span className="text-sm text-gray-500">
                Deadline: {new Date(proposal.deadline).toLocaleDateString()}
              </span>
            </div>

            {error[proposal.id] && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error[proposal.id]}</span>
              </div>
            )}

            {!isExpired(proposal.deadline) && (
              <div className="space-y-4 mb-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVote(proposal.id, 'yes')}
                    disabled={loading[proposal.id]}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      votes[proposal.id] === 'yes'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 'no')}
                    disabled={loading[proposal.id]}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      votes[proposal.id] === 'no'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:border-red-600'
                    }`}
                  >
                    No
                  </button>
                </div>
                
                <button
                  onClick={() => handleSubmit(proposal.id)}
                  disabled={!votes[proposal.id] || loading[proposal.id]}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 flex items-center justify-center space-x-2"
                >
                  {loading[proposal.id] ? (
                    <>
                      <Loader className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Vote</span>
                  )}
                </button>
              </div>
            )}

            <VoteStats proposal={proposal} />
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Check, AlertCircle, Loader } from 'lucide-react';
import { storeVote } from '../services/pinata';

const proposals = [
  {
    id: 1,
    title: 'Community Treasury Allocation',
    description: 'Allocate 1000 tokens to community development initiatives',
    deadline: '2024-03-20',
  },
  {
    id: 2,
    title: 'Protocol Upgrade Proposal',
    description: 'Implement new security features in the next protocol version',
    deadline: '2024-03-25',
  },
];

export default function VotingInterface() {
  const [votes, setVotes] = useState<Record<number, 'yes' | 'no'>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, string>>({});

  const handleVote = (proposalId: number, vote: 'yes' | 'no') => {
    setVotes(prev => ({ ...prev, [proposalId]: vote }));
    setError(prev => ({ ...prev, [proposalId]: '' }));
  };

  const handleSubmit = async (proposalId: number) => {
    setLoading(prev => ({ ...prev, [proposalId]: true }));
    setError(prev => ({ ...prev, [proposalId]: '' }));

    try {
      // Simulated voter hash - in production, this would be derived from the user's credential
      const voterHash = '0x' + Math.random().toString(16).slice(2, 42);
      
      await storeVote(proposalId, votes[proposalId], voterHash);
      setSubmitted(prev => ({ ...prev, [proposalId]: true }));
    } catch (err) {
      setError(prev => ({
        ...prev,
        [proposalId]: 'Failed to submit vote. Please try again.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Active Proposals</h2>
      
      <div className="space-y-6">
        {proposals.map(proposal => (
          <div
            key={proposal.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {proposal.title}
                </h3>
                <p className="text-gray-600 mt-1">{proposal.description}</p>
              </div>
              <span className="text-sm text-gray-500">
                Deadline: {proposal.deadline}
              </span>
            </div>

            {error[proposal.id] && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error[proposal.id]}</span>
              </div>
            )}

            {submitted[proposal.id] ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Check />
                <span>Vote submitted successfully</span>
              </div>
            ) : (
              <div className="space-y-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}
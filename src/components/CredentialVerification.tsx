import React, { useState, useEffect } from 'react';
import { UserCheck, Loader, AlertCircle } from 'lucide-react';
import { storeCredential, retrieveCredential, revokeCredential } from '../services/pinata';
import { Credential } from '../types';
import CredentialCard from './CredentialCard';

interface Props {
  onVerified: () => void;
}

export default function CredentialVerification({ onVerified }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    checkExistingCredential();
  }, []);

  const checkExistingCredential = async () => {
    setIsLoading(true);
    try {
      // In production, this would come from wallet connection
      const address = '0x' + Math.random().toString(16).slice(2, 42);
      const existingCredential = await retrieveCredential(address);
      
      if (existingCredential && existingCredential.status === 'active') {
        setCredential(existingCredential);
        onVerified();
      }
    } catch (err) {
      console.error('Error checking credential:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, this would come from wallet connection
      const address = '0x' + Math.random().toString(16).slice(2, 42);
      
      const newCredential = {
        type: 'ProofOfPersonhood',
        createdAt: new Date().toISOString(),
        address,
        hash: '0x' + Math.random().toString(16).slice(2),
        status: 'active' as const,
      };

      await storeCredential(address, newCredential);
      setCredential(newCredential);
      onVerified();
    } catch (err) {
      setError('Failed to verify credential. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!credential) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await revokeCredential(credential.address);
      setCredential(prev => prev ? { ...prev, status: 'revoked' } : null);
    } catch (err) {
      setError('Failed to revoke credential. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {credential ? (
        <CredentialCard 
          credential={credential}
          onRevoke={credential.status === 'active' ? handleRevoke : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <UserCheck className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Identity
            </h2>
            <p className="text-gray-600">
              Connect your wallet to verify your proof of personhood credential
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center space-x-2"
          >
            <span>Start Verification</span>
          </button>
        </div>
      )}
    </div>
  );
}
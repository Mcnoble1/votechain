import React, { useState } from 'react';
import { UserCheck, Loader, AlertCircle } from 'lucide-react';
import { storeCredential, verifyCredential } from '../services/pinata';

interface Props {
  onVerified: () => void;
}

export default function CredentialVerification({ onVerified }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated wallet address - in production, this would come from wallet connection
      const address = '0x' + Math.random().toString(16).slice(2, 42);
      
      // Check if credential already exists
      const hasCredential = await verifyCredential(address);
      
      if (hasCredential) {
        onVerified();
        return;
      }

      // Create new credential
      const credential = {
        type: 'ProofOfPersonhood',
        createdAt: new Date().toISOString(),
        // Add additional verification data as needed
      };

      await storeCredential(address, credential);
      onVerified();
    } catch (err) {
      setError('Failed to verify credential. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
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
        {isLoading ? (
          <>
            <Loader className="animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Start Verification</span>
          </>
        )}
      </button>
    </div>
  );
}
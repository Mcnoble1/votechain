import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { listCredentials, revokeCredential } from '../services/pinata';
import { Credential } from '../types';
import CredentialsList from './CredentialsList';

export default function CredentialManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedCredentials = await listCredentials();
      setCredentials(fetchedCredentials);
    } catch (err) {
      setError('Failed to fetch credentials. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleRevoke = async (address: string) => {
    try {
      await revokeCredential(address);
      await fetchCredentials(); // Refresh the list
    } catch (err) {
      setError('Failed to revoke credential. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Credentials
          </h2>
          <button
            onClick={fetchCredentials}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <CredentialsList
          credentials={credentials}
          isLoading={isLoading}
          onRevoke={handleRevoke}
        />
      </div>
    </div>
  );
}
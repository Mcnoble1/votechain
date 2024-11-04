import React, { useState } from 'react';
import CredentialVerification from './components/CredentialVerification';
import VotingInterface from './components/VotingInterface';
import CredentialManager from './components/CredentialManager';
import { AuthStatus } from './types';

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('unverified');
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Decentralized Voting
              </h1>
            </div>
            {authStatus === 'verified' && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showCredentials ? 'View Proposals' : 'View Credentials'}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {authStatus === 'unverified' ? (
          <CredentialVerification onVerified={() => setAuthStatus('verified')} />
        ) : showCredentials ? (
          <CredentialManager />
        ) : (
          <VotingInterface />
        )}
      </div>
    </div>
  );
}

export default App;
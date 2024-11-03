import React, { useState } from 'react';
import CredentialVerification from './components/CredentialVerification';
import VotingInterface from './components/VotingInterface';
import { AuthStatus } from './types';

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('unverified');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {authStatus === 'unverified' ? (
        <CredentialVerification onVerified={() => setAuthStatus('verified')} />
      ) : (
        <VotingInterface />
      )}
    </div>
  );
}

export default App;
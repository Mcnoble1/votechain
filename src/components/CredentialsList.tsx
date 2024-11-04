import React from 'react';
import { Loader } from 'lucide-react';
import CredentialCard from './CredentialCard';
import { Credential } from '../types';

interface Props {
  credentials: Credential[];
  isLoading: boolean;
  onRevoke: (address: string) => Promise<void>;
}

export default function CredentialsList({ credentials, isLoading, onRevoke }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No credentials found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.hash}
          credential={credential}
          onRevoke={() => onRevoke(credential.address)}
        />
      ))}
    </div>
  );
}
import React from 'react';
import { Shield, Clock, Hash } from 'lucide-react';
import { Credential } from '../types';

interface Props {
  credential: Credential;
  onRevoke?: () => void;
}

export default function CredentialCard({ credential, onRevoke }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Proof of Personhood Credential
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          credential.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {credential.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Created: {new Date(credential.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <Hash className="w-4 h-4" />
          <span className="font-mono text-sm break-all">{credential.hash}</span>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            This credential proves your unique identity in the voting system.
            Keep it safe and do not share it with others.
          </p>
          
          {credential.status === 'active' && onRevoke && (
            <button
              onClick={onRevoke}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Revoke Credential
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
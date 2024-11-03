import React from 'react';
import { Vote } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">VoteChain</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              About
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
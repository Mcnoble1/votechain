import React from 'react';
import { Proposal } from '../types';

interface VoteStatsProps {
  proposal: Proposal;
}

export default function VoteStats({ proposal }: VoteStatsProps) {
  const { voteCount } = proposal;
  
  if (!voteCount) {
    return null;
  }

  const total = voteCount.yes + voteCount.no;
  const yesPercentage = total > 0 ? (voteCount.yes / total) * 100 : 0;
  const noPercentage = total > 0 ? (voteCount.no / total) * 100 : 0;

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-lg font-semibold mb-2">Current Results</h4>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span>Yes ({voteCount.yes})</span>
            <span>{yesPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${yesPercentage}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>No ({voteCount.no})</span>
            <span>{noPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{ width: `${noPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Total Votes: {total}
        </div>
      </div>
    </div>
  );
}
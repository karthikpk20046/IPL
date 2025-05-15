import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { LiveMatch } from '../types';

interface LiveMatchCardProps {
  match: LiveMatch;
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Match Header */}
      <div className="bg-[#004c93] text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">LIVE</span>
            <span className="ml-2">{match.status}</span>
          </div>
          <div>
            <span className="text-sm">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold mb-2">
              {match.homeTeam.substring(0, 3).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold">{match.homeTeam}</h3>
            <p className="text-2xl font-bold text-[#004c93]">{match.homeScore || '0-0'}</p>
          </div>

          {/* VS */}
          <div className="text-gray-500 text-2xl font-bold">VS</div>

          {/* Away Team */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold mb-2">
              {match.awayTeam.substring(0, 3).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold">{match.awayTeam}</h3>
            <p className="text-2xl font-bold text-[#004c93]">{match.awayScore || '0-0'}</p>
          </div>
        </div>

        {/* Live Match Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1"><span className="font-semibold">Current Over:</span> {match.overs}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">Required Rate:</span> {match.requiredRate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1"><span className="font-semibold">Batsman:</span> {match.currentBatsmen || 'N/A'}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">Bowler:</span> {match.currentBowler || 'N/A'}</p>
            </div>
          </div>
          
          {match.lastWicket && (
            <div className="mt-4">
              <p className="text-gray-600"><span className="font-semibold">Last Wicket:</span> {match.lastWicket}</p>
            </div>
          )}
          
          {match.recentOvers && (
            <div className="mt-4">
              <p className="text-gray-600"><span className="font-semibold">Recent:</span> {match.recentOvers}</p>
            </div>
          )}
        </div>

        {/* Updated timestamp */}
        <div className="mt-4 text-right text-sm text-gray-500">
          Updated {formatDistanceToNow(new Date(match.updatedAt))} ago
        </div>
      </div>
    </div>
  );
};

export default LiveMatchCard;
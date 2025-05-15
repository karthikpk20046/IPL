import React from 'react';
import { format } from 'date-fns';
import { Match } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface NextMatchCardProps {
  match: Match;
}

const NextMatchCard: React.FC<NextMatchCardProps> = ({ match }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Match header */}
      <div className="bg-[#004c93] text-white p-3">
        <span className="text-sm font-medium">Match #{match.matchNumber}</span>
      </div>
      
      {/* Teams */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold mb-2">
              {match.homeTeam.shortName}
            </div>
            <h3 className="text-sm font-bold">{match.homeTeam.name}</h3>
          </div>

          {/* VS */}
          <div className="text-gray-500 text-lg font-bold mx-2">VS</div>

          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold mb-2">
              {match.awayTeam.shortName}
            </div>
            <h3 className="text-sm font-bold">{match.awayTeam.name}</h3>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#ff7e00]" />
            <span>{format(new Date(match.date), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#ff7e00]" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#ff7e00]" />
            <span>{match.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextMatchCard;
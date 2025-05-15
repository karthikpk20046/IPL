import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getFullSchedule } from '../api/scheduleService';
import { Match } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const data = await getFullSchedule();
        setSchedule(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load schedule.');
        setIsLoading(false);
        console.error('Error fetching schedule:', err);
      }
    };

    fetchSchedule();
  }, []);

  const filteredSchedule = schedule.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return match.status === 'UPCOMING';
    if (filter === 'completed') return match.status === 'COMPLETED';
    return true;
  });

  // Group matches by date
  const groupedSchedule: { [key: string]: Match[] } = {};
  
  filteredSchedule.forEach(match => {
    const dateStr = format(new Date(match.date), 'yyyy-MM-dd');
    if (!groupedSchedule[dateStr]) {
      groupedSchedule[dateStr] = [];
    }
    groupedSchedule[dateStr].push(match);
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004c93] mb-6">IPL Schedule</h1>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-[#004c93] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All Matches
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${filter === 'upcoming' ? 'bg-[#004c93] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-[#004c93] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c93]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedule).length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">No matches found for the selected filter.</p>
            </div>
          ) : (
            Object.entries(groupedSchedule).map(([dateStr, matches]) => (
              <div key={dateStr} className="space-y-4">
                <h3 className="text-lg font-semibold bg-gray-100 p-2 rounded">
                  {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(match => (
                    <div 
                      key={match.id} 
                      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${match.status === 'COMPLETED' ? 'border-l-4 border-gray-400' : match.status === 'LIVE' ? 'border-l-4 border-green-500' : 'border-l-4 border-[#ff7e00]'}`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-semibold text-gray-500">Match #{match.matchNumber}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            match.status === 'COMPLETED' ? 'bg-gray-200 text-gray-700' : 
                            match.status === 'LIVE' ? 'bg-green-100 text-green-800' : 
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {match.status}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          {/* Home Team */}
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold mb-2">
                              {match.homeTeam.shortName}
                            </div>
                            <h3 className="text-sm font-bold">{match.homeTeam.name}</h3>
                            {match.status === 'COMPLETED' && (
                              <p className="text-sm">{match.homeTeamScore}</p>
                            )}
                          </div>

                          {/* VS */}
                          <div className="text-gray-500 text-lg font-bold mx-2">VS</div>

                          {/* Away Team */}
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold mb-2">
                              {match.awayTeam.shortName}
                            </div>
                            <h3 className="text-sm font-bold">{match.awayTeam.name}</h3>
                            {match.status === 'COMPLETED' && (
                              <p className="text-sm">{match.awayTeamScore}</p>
                            )}
                          </div>
                        </div>

                        {match.status === 'COMPLETED' && match.result && (
                          <div className="text-center text-sm font-medium text-gray-700 mb-4">
                            {match.result}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-gray-600 text-sm">
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
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
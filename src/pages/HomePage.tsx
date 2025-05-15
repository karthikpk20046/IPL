import React, { useState, useEffect } from 'react';
import LiveMatchCard from '../components/LiveMatchCard';
import NextMatchCard from '../components/NextMatchCard';
import { LiveMatch, Match } from '../types';
import { getLiveMatch, getUpcomingMatches } from '../api/matchService';

const HomePage: React.FC = () => {
  const [liveMatch, setLiveMatch] = useState<LiveMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextMatches, setNextMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch live match data
        const liveMatchData = await getLiveMatch();
        setLiveMatch(liveMatchData);
        
        // Fetch upcoming matches
        const upcomingMatches = await getUpcomingMatches(3);
        setNextMatches(upcomingMatches);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load match information.');
        setIsLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();

    // Polling for live match updates every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const liveMatchData = await getLiveMatch();
        setLiveMatch(liveMatchData);
      } catch (err) {
        console.error('Error polling live match:', err);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004c93] mb-6">IPL T20 Live Dashboard</h1>
      
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
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Live Match</h2>
            {liveMatch && liveMatch.status === 'LIVE' ? (
              <LiveMatchCard match={liveMatch} />
            ) : (
              <div className="card bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">No live matches at the moment.</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upcoming Matches</h2>
            {nextMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nextMatches.map((match) => (
                  <NextMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="card bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">No upcoming matches scheduled.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
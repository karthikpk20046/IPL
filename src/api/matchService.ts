import { LiveMatch, Match } from '../types';

// In a real app, we would make HTTP requests to the backend API
// For this sample, we'll simulate the API calls with local data

export const getLiveMatch = async (): Promise<LiveMatch | null> => {
  try {
    const response = await fetch('/api/matches/live');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching live match:', error);
    return null;
  }
};

export const getUpcomingMatches = async (limit = 3): Promise<Match[]> => {
  try {
    const response = await fetch(`/api/matches/upcoming?limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
};

export const getMatchById = async (id: string): Promise<Match | null> => {
  try {
    const response = await fetch(`/api/matches/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error);
    return null;
  }
};
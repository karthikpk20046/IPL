import { Match } from '../types';

export const getFullSchedule = async (): Promise<Match[]> => {
  try {
    const response = await fetch('/api/schedule');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};
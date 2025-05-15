import { PointsTableEntry } from '../types';

export const getPointsTable = async (): Promise<PointsTableEntry[]> => {
  try {
    const response = await fetch('/api/points-table');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching points table:', error);
    return [];
  }
};
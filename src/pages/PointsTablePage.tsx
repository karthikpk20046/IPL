import React, { useState, useEffect } from 'react';
import { getPointsTable } from '../api/pointsTableService';
import { PointsTableEntry } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const PointsTablePage: React.FC = () => {
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof PointsTableEntry>('points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchPointsTable = async () => {
      try {
        setIsLoading(true);
        const data = await getPointsTable();
        setPointsTable(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load points table.');
        setIsLoading(false);
        console.error('Error fetching points table:', err);
      }
    };

    fetchPointsTable();
  }, []);

  const handleSort = (field: keyof PointsTableEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'netRunRate' ? 'desc' : 'desc');
    }
  };

  const sortedPointsTable = [...pointsTable].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    
    // If points are equal, sort by NRR
    if (sortField === 'points' && a.points === b.points) {
      return a.netRunRate > b.netRunRate ? -1 : 1;
    }
    
    return 0;
  });

  const getSortIcon = (field: keyof PointsTableEntry) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004c93] mb-6">Points Table</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c93]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-[#004c93] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Pos</th>
                <th className="py-3 px-4 text-left">Team</th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('played')}
                >
                  <div className="flex items-center">
                    P {getSortIcon('played')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('won')}
                >
                  <div className="flex items-center">
                    W {getSortIcon('won')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('lost')}
                >
                  <div className="flex items-center">
                    L {getSortIcon('lost')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hidden sm:table-cell"
                  onClick={() => handleSort('tied')}
                >
                  <div className="flex items-center">
                    T {getSortIcon('tied')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hidden sm:table-cell"
                  onClick={() => handleSort('noResult')}
                >
                  <div className="flex items-center">
                    NR {getSortIcon('noResult')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('netRunRate')}
                >
                  <div className="flex items-center">
                    NRR {getSortIcon('netRunRate')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('points')}
                >
                  <div className="flex items-center">
                    Pts {getSortIcon('points')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPointsTable.map((entry, index) => (
                <tr 
                  key={entry.id} 
                  className={`border-b border-gray-200 ${index < 4 ? 'bg-blue-50' : ''} hover:bg-gray-100`}
                >
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {entry.team.shortName}
                      </div>
                      <span>{entry.team.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{entry.played}</td>
                  <td className="py-3 px-4">{entry.won}</td>
                  <td className="py-3 px-4">{entry.lost}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">{entry.tied}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">{entry.noResult}</td>
                  <td className="py-3 px-4">{entry.netRunRate.toFixed(3)}</td>
                  <td className="py-3 px-4 font-bold">{entry.points}</td>
                </tr>
              ))}
              {pointsTable.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-semibold mb-1">Points Calculation:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Win: 2 points</li>
          <li>Loss: 0 points</li>
          <li>No Result/Tie: 1 point</li>
        </ul>
        <p className="mt-2">Top 4 teams (highlighted) qualify for playoffs.</p>
      </div>
    </div>
  );
};

export default PointsTablePage;
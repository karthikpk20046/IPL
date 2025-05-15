export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
}

export interface Match {
  id: string;
  matchNumber: number;
  date: string;
  time: string;
  venue: string;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamScore?: string;
  awayTeamScore?: string;
  result?: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface LiveMatch {
  id: string;
  matchId?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  status: string;
  venue: string;
  overs?: string;
  currentBatsmen?: string;
  currentBowler?: string;
  lastWicket?: string;
  recentOvers?: string;
  requiredRate?: string;
  updatedAt: string;
}

export interface PointsTableEntry {
  id: string;
  team: Team;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
}
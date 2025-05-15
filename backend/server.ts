import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Middleware to check if database exists, if not use dummy data
const useDummyData = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Check if database file exists
    const dbPath = path.join(process.cwd(), 'backend/data/ipl.db');
    const dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
      // If database doesn't exist, set flag to use dummy data
      req.app.locals.useDummyData = true;
    } else {
      // If database exists, check if it has data
      const teams = await prisma.team.findMany();
      req.app.locals.useDummyData = teams.length === 0;
    }
    
    next();
  } catch (error) {
    console.error('Error checking database:', error);
    req.app.locals.useDummyData = true;
    next();
  }
};

// Apply middleware
app.use(useDummyData);

// Helper function to load dummy data
function loadDummyData() {
  try {
    const filePath = path.join(process.cwd(), 'backend/data/dummy.json');
    const dummyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return dummyData;
  } catch (error) {
    console.error('Error loading dummy data:', error);
    return null;
  }
}

// API Routes
app.get('/api/teams', async (req, res) => {
  try {
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      return res.json(dummyData.teams);
    }

    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/points-table', async (req, res) => {
  try {
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      const pointsTableWithTeams = dummyData.pointsTable.map((entry: any) => {
        const team = dummyData.teams.find((t: any) => t.id === entry.teamId);
        return {
          ...entry,
          team
        };
      });
      return res.json(pointsTableWithTeams);
    }

    const pointsTable = await prisma.pointsTable.findMany({
      include: {
        team: true
      },
      orderBy: [
        { points: 'desc' },
        { netRunRate: 'desc' }
      ]
    });
    res.json(pointsTable);
  } catch (error) {
    console.error('Error fetching points table:', error);
    res.status(500).json({ error: 'Failed to fetch points table' });
  }
});

app.get('/api/schedule', async (req, res) => {
  try {
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      const schedule = dummyData.matches.map((match: any) => {
        const homeTeam = dummyData.teams.find((t: any) => t.id === match.homeTeamId);
        const awayTeam = dummyData.teams.find((t: any) => t.id === match.awayTeamId);
        return {
          ...match,
          homeTeam,
          awayTeam
        };
      });
      return res.json(schedule);
    }

    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

app.get('/api/matches/live', async (req, res) => {
  try {
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      if (dummyData.liveMatch) {
        return res.json({
          ...dummyData.liveMatch,
          updatedAt: new Date().toISOString()
        });
      }
      return res.json(null);
    }

    const liveMatch = await prisma.liveMatch.findUnique({
      where: { id: 'current' }
    });
    
    if (liveMatch && liveMatch.status === 'LIVE') {
      res.json(liveMatch);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error fetching live match:', error);
    res.status(500).json({ error: 'Failed to fetch live match' });
  }
});

app.get('/api/matches/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 3;
    
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      const upcomingMatches = dummyData.matches
        .filter((match: any) => match.status === 'UPCOMING')
        .slice(0, limit)
        .map((match: any) => {
          const homeTeam = dummyData.teams.find((t: any) => t.id === match.homeTeamId);
          const awayTeam = dummyData.teams.find((t: any) => t.id === match.awayTeamId);
          return {
            ...match,
            homeTeam,
            awayTeam
          };
        });
      return res.json(upcomingMatches);
    }

    const upcomingMatches = await prisma.match.findMany({
      where: {
        status: 'UPCOMING'
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        date: 'asc'
      },
      take: limit
    });
    res.json(upcomingMatches);
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming matches' });
  }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.app.locals.useDummyData) {
      const dummyData = loadDummyData();
      const match = dummyData.matches.find((m: any) => m.id === id);
      if (match) {
        const homeTeam = dummyData.teams.find((t: any) => t.id === match.homeTeamId);
        const awayTeam = dummyData.teams.find((t: any) => t.id === match.awayTeamId);
        return res.json({
          ...match,
          homeTeam,
          awayTeam
        });
      }
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });
    
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({ error: 'Match not found' });
    }
  } catch (error) {
    console.error(`Error fetching match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'https://www.iplt20.com';

interface TeamData {
  name: string;
  shortName: string;
  logoUrl?: string;
}

interface PointsTableData {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
}

interface MatchData {
  matchNumber: number;
  date: Date;
  time: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamScore?: string;
  awayTeamScore?: string;
  result?: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

interface LiveMatchData {
  status: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  overs?: string;
  currentBatsmen?: string;
  currentBowler?: string;
  lastWicket?: string;
  recentOvers?: string;
  requiredRate?: string;
  venue: string;
}

// Function to scrape teams
async function scrapeTeams(): Promise<TeamData[]> {
  try {
    console.log('Scraping teams...');
    const response = await axios.get(`${BASE_URL}/teams`);
    const $ = cheerio.load(response.data);
    const teams: TeamData[] = [];

    // Your implementation to extract team data from HTML
    // Since actual implementation would depend on the HTML structure of iplt20.com
    // This is a simplified version

    $('.team-card').each((_, element) => {
      const name = $(element).find('.team-name').text().trim();
      const shortName = $(element).find('.team-short-name').text().trim();
      const logoUrl = $(element).find('img').attr('src');
      
      teams.push({
        name,
        shortName: shortName || name.split(' ').map(word => word[0]).join(''),
        logoUrl: logoUrl ? `${BASE_URL}${logoUrl}` : undefined
      });
    });

    // If scraping fails, return dummy data
    if (teams.length === 0) {
      console.log('Scraping failed, returning dummy teams data');
      return [
        { name: "Mumbai Indians", shortName: "MI" },
        { name: "Chennai Super Kings", shortName: "CSK" },
        { name: "Royal Challengers Bangalore", shortName: "RCB" },
        { name: "Kolkata Knight Riders", shortName: "KKR" },
        { name: "Delhi Capitals", shortName: "DC" },
        { name: "Punjab Kings", shortName: "PBKS" },
        { name: "Rajasthan Royals", shortName: "RR" },
        { name: "Sunrisers Hyderabad", shortName: "SRH" },
        { name: "Lucknow Super Giants", shortName: "LSG" },
        { name: "Gujarat Titans", shortName: "GT" }
      ];
    }

    return teams;
  } catch (error) {
    console.error('Error scraping teams:', error);
    
    // Return dummy data if scraping fails
    return [
      { name: "Mumbai Indians", shortName: "MI" },
      { name: "Chennai Super Kings", shortName: "CSK" },
      { name: "Royal Challengers Bangalore", shortName: "RCB" },
      { name: "Kolkata Knight Riders", shortName: "KKR" },
      { name: "Delhi Capitals", shortName: "DC" },
      { name: "Punjab Kings", shortName: "PBKS" },
      { name: "Rajasthan Royals", shortName: "RR" },
      { name: "Sunrisers Hyderabad", shortName: "SRH" },
      { name: "Lucknow Super Giants", shortName: "LSG" },
      { name: "Gujarat Titans", shortName: "GT" }
    ];
  }
}

// Function to scrape points table
async function scrapePointsTable(): Promise<PointsTableData[]> {
  try {
    console.log('Scraping points table...');
    const response = await axios.get(`${BASE_URL}/points-table`);
    const $ = cheerio.load(response.data);
    const pointsTable: PointsTableData[] = [];

    // Your implementation to extract points table data from HTML
    // Since actual implementation would depend on the HTML structure of iplt20.com
    // This is a simplified version

    $('.points-table tbody tr').each((_, element) => {
      const team = $(element).find('td:nth-child(1)').text().trim();
      const played = parseInt($(element).find('td:nth-child(2)').text().trim());
      const won = parseInt($(element).find('td:nth-child(3)').text().trim());
      const lost = parseInt($(element).find('td:nth-child(4)').text().trim());
      const tied = parseInt($(element).find('td:nth-child(5)').text().trim());
      const noResult = parseInt($(element).find('td:nth-child(6)').text().trim());
      const points = parseInt($(element).find('td:nth-child(7)').text().trim());
      const netRunRate = parseFloat($(element).find('td:nth-child(8)').text().trim());
      
      pointsTable.push({
        team,
        played,
        won,
        lost,
        tied,
        noResult,
        points,
        netRunRate
      });
    });

    // If scraping fails, return dummy data
    if (pointsTable.length === 0) {
      console.log('Scraping failed, returning dummy points table data');
      return loadDummyPointsTable();
    }

    return pointsTable;
  } catch (error) {
    console.error('Error scraping points table:', error);
    
    // Return dummy data if scraping fails
    return loadDummyPointsTable();
  }
}

// Function to scrape schedule
async function scrapeSchedule(): Promise<MatchData[]> {
  try {
    console.log('Scraping schedule...');
    const response = await axios.get(`${BASE_URL}/matches`);
    const $ = cheerio.load(response.data);
    const schedule: MatchData[] = [];

    // Your implementation to extract schedule data from HTML
    // Since actual implementation would depend on the HTML structure of iplt20.com
    // This is a simplified version

    $('.match-card').each((_, element) => {
      const matchNumber = parseInt($(element).find('.match-number').text().replace('Match', '').trim());
      const dateStr = $(element).find('.match-date').text().trim();
      const time = $(element).find('.match-time').text().trim();
      const venue = $(element).find('.match-venue').text().trim();
      const homeTeam = $(element).find('.home-team').text().trim();
      const awayTeam = $(element).find('.away-team').text().trim();
      const status = $(element).find('.match-status').text().trim();
      
      let matchStatus: 'UPCOMING' | 'LIVE' | 'COMPLETED' = 'UPCOMING';
      if (status.includes('Live')) {
        matchStatus = 'LIVE';
      } else if (status.includes('Result')) {
        matchStatus = 'COMPLETED';
      }

      const match: MatchData = {
        matchNumber,
        date: new Date(dateStr),
        time,
        venue,
        homeTeam,
        awayTeam,
        status: matchStatus
      };

      if (matchStatus === 'COMPLETED') {
        match.homeTeamScore = $(element).find('.home-team-score').text().trim();
        match.awayTeamScore = $(element).find('.away-team-score').text().trim();
        match.result = $(element).find('.match-result').text().trim();
      }

      schedule.push(match);
    });

    // If scraping fails, return dummy data
    if (schedule.length === 0) {
      console.log('Scraping failed, returning dummy schedule data');
      return loadDummySchedule();
    }

    return schedule;
  } catch (error) {
    console.error('Error scraping schedule:', error);
    
    // Return dummy data if scraping fails
    return loadDummySchedule();
  }
}

// Function to scrape live match
async function scrapeLiveMatch(): Promise<LiveMatchData | null> {
  try {
    console.log('Scraping live match...');
    const response = await axios.get(`${BASE_URL}`);
    const $ = cheerio.load(response.data);
    
    const liveMatchElement = $('.live-match');
    
    if (liveMatchElement.length === 0) {
      console.log('No live match found');
      return null;
    }
    
    const homeTeam = liveMatchElement.find('.home-team').text().trim();
    const awayTeam = liveMatchElement.find('.away-team').text().trim();
    const homeScore = liveMatchElement.find('.home-team-score').text().trim();
    const awayScore = liveMatchElement.find('.away-team-score').text().trim();
    const overs = liveMatchElement.find('.overs').text().trim();
    const currentBatsmen = liveMatchElement.find('.current-batsmen').text().trim();
    const currentBowler = liveMatchElement.find('.current-bowler').text().trim();
    const lastWicket = liveMatchElement.find('.last-wicket').text().trim();
    const recentOvers = liveMatchElement.find('.recent-overs').text().trim();
    const requiredRate = liveMatchElement.find('.required-rate').text().trim();
    const venue = liveMatchElement.find('.venue').text().trim();
    
    return {
      status: 'LIVE',
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      overs,
      currentBatsmen,
      currentBowler,
      lastWicket,
      recentOvers,
      requiredRate,
      venue
    };
  } catch (error) {
    console.error('Error scraping live match:', error);
    
    // Return dummy data if scraping fails
    return loadDummyLiveMatch();
  }
}

// Function to load dummy data from JSON
function loadDummyData() {
  try {
    const filePath = path.join(process.cwd(), 'backend/data/dummy.json');
    const dummyData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(dummyData);
  } catch (error) {
    console.error('Error loading dummy data:', error);
    throw error;
  }
}

function loadDummyPointsTable(): PointsTableData[] {
  const dummyData = loadDummyData();
  return dummyData.pointsTable.map((entry: any) => {
    const team = dummyData.teams.find((t: any) => t.id === entry.teamId);
    return {
      team: team.name,
      played: entry.played,
      won: entry.won,
      lost: entry.lost,
      tied: entry.tied,
      noResult: entry.noResult,
      points: entry.points,
      netRunRate: entry.netRunRate
    };
  });
}

function loadDummySchedule(): MatchData[] {
  const dummyData = loadDummyData();
  return dummyData.matches.map((match: any) => {
    const homeTeam = dummyData.teams.find((t: any) => t.id === match.homeTeamId);
    const awayTeam = dummyData.teams.find((t: any) => t.id === match.awayTeamId);
    
    return {
      matchNumber: match.matchNumber,
      date: new Date(match.date),
      time: match.time,
      venue: match.venue,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      result: match.result,
      status: match.status as 'UPCOMING' | 'LIVE' | 'COMPLETED'
    };
  });
}

function loadDummyLiveMatch(): LiveMatchData | null {
  const dummyData = loadDummyData();
  if (!dummyData.liveMatch) return null;
  
  const liveMatch = dummyData.liveMatch;
  return {
    status: liveMatch.status,
    homeTeam: liveMatch.homeTeam,
    awayTeam: liveMatch.awayTeam,
    homeScore: liveMatch.homeScore,
    awayScore: liveMatch.awayScore,
    overs: liveMatch.overs,
    currentBatsmen: liveMatch.currentBatsmen,
    currentBowler: liveMatch.currentBowler,
    lastWicket: liveMatch.lastWicket,
    recentOvers: liveMatch.recentOvers,
    requiredRate: liveMatch.requiredRate,
    venue: liveMatch.venue
  };
}

// Main function to scrape all data and store in database
async function scrapeAndStoreData() {
  try {
    console.log('Starting data scraping process...');
    
    // Check if teams exist, if not insert them
    const existingTeams = await prisma.team.findMany();
    if (existingTeams.length === 0) {
      console.log('No teams found in database. Scraping and inserting teams...');
      const teams = await scrapeTeams();
      
      for (const team of teams) {
        await prisma.team.create({
          data: team
        });
      }
      console.log(`Inserted ${teams.length} teams.`);
    } else {
      console.log(`Found ${existingTeams.length} teams in database. Skipping team scraping.`);
    }
    
    // Scrape and update points table
    console.log('Updating points table...');
    const pointsTableData = await scrapePointsTable();
    const teams = await prisma.team.findMany();
    
    for (const entry of pointsTableData) {
      const team = teams.find(t => t.name === entry.team);
      
      if (!team) {
        console.log(`Team '${entry.team}' not found in database. Skipping points table entry.`);
        continue;
      }
      
      await prisma.pointsTable.upsert({
        where: {
          teamId: team.id
        },
        update: {
          played: entry.played,
          won: entry.won,
          lost: entry.lost,
          tied: entry.tied,
          noResult: entry.noResult,
          points: entry.points,
          netRunRate: entry.netRunRate
        },
        create: {
          teamId: team.id,
          played: entry.played,
          won: entry.won,
          lost: entry.lost,
          tied: entry.tied,
          noResult: entry.noResult,
          points: entry.points,
          netRunRate: entry.netRunRate
        }
      });
    }
    console.log('Points table updated successfully.');
    
    // Scrape and update schedule
    console.log('Updating match schedule...');
    const scheduleData = await scrapeSchedule();
    
    for (const match of scheduleData) {
      const homeTeam = teams.find(t => t.name === match.homeTeam);
      const awayTeam = teams.find(t => t.name === match.awayTeam);
      
      if (!homeTeam || !awayTeam) {
        console.log(`Team '${match.homeTeam}' or '${match.awayTeam}' not found in database. Skipping match.`);
        continue;
      }
      
      await prisma.match.upsert({
        where: {
          id: `${match.matchNumber.toString()}`
        },
        update: {
          date: match.date,
          time: match.time,
          venue: match.venue,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeTeamScore: match.homeTeamScore,
          awayTeamScore: match.awayTeamScore,
          result: match.result,
          status: match.status
        },
        create: {
          id: `${match.matchNumber.toString()}`,
          matchNumber: match.matchNumber,
          date: match.date,
          time: match.time,
          venue: match.venue,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeTeamScore: match.homeTeamScore,
          awayTeamScore: match.awayTeamScore,
          result: match.result,
          status: match.status
        }
      });
    }
    console.log('Match schedule updated successfully.');
    
    // Scrape and update live match
    console.log('Checking for live match...');
    const liveMatchData = await scrapeLiveMatch();
    
    if (liveMatchData) {
      console.log('Live match found. Updating database...');
      
      // Get the match ID by looking up the teams
      const homeTeam = teams.find(t => t.name === liveMatchData.homeTeam);
      const awayTeam = teams.find(t => t.name === liveMatchData.awayTeam);
      let matchId: string | undefined;
      
      if (homeTeam && awayTeam) {
        const match = await prisma.match.findFirst({
          where: {
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            status: 'LIVE'
          }
        });
        matchId = match?.id;
      }
      
      await prisma.liveMatch.upsert({
        where: {
          id: 'current'
        },
        update: {
          matchId,
          status: liveMatchData.status,
          homeTeam: liveMatchData.homeTeam,
          awayTeam: liveMatchData.awayTeam,
          homeScore: liveMatchData.homeScore,
          awayScore: liveMatchData.awayScore,
          overs: liveMatchData.overs,
          currentBatsmen: liveMatchData.currentBatsmen,
          currentBowler: liveMatchData.currentBowler,
          lastWicket: liveMatchData.lastWicket,
          recentOvers: liveMatchData.recentOvers,
          requiredRate: liveMatchData.requiredRate
        },
        create: {
          id: 'current',
          matchId,
          status: liveMatchData.status,
          homeTeam: liveMatchData.homeTeam,
          awayTeam: liveMatchData.awayTeam,
          homeScore: liveMatchData.homeScore,
          awayScore: liveMatchData.awayScore,
          overs: liveMatchData.overs,
          currentBatsmen: liveMatchData.currentBatsmen,
          currentBowler: liveMatchData.currentBowler,
          lastWicket: liveMatchData.lastWicket,
          recentOvers: liveMatchData.recentOvers,
          requiredRate: liveMatchData.requiredRate
        }
      });
      
      console.log('Live match updated successfully.');
    } else {
      console.log('No live match found.');
      
      // If there's no live match, update the status in the database
      const existingLiveMatch = await prisma.liveMatch.findUnique({
        where: {
          id: 'current'
        }
      });
      
      if (existingLiveMatch) {
        await prisma.liveMatch.update({
          where: {
            id: 'current'
          },
          data: {
            status: 'NO_LIVE_MATCH'
          }
        });
        console.log('Live match status updated to NO_LIVE_MATCH.');
      }
    }
    
    console.log('Data scraping process completed successfully.');
  } catch (error) {
    console.error('Error in data scraping process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the scraping process
scrapeAndStoreData()
  .catch(e => {
    console.error('Error in main scraping function:', e);
    process.exit(1);
  });
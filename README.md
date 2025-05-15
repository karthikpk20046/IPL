# IPL T20 Live Dashboard

A fullstack web application that displays live IPL (Indian Premier League) T20 cricket data including live matches, upcoming fixtures, points table, and complete match schedule.

## Tech Stack

### Frontend
- Vite + React + TypeScript
- TailwindCSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- TypeScript
- SQLite database
- Prisma ORM
- Cheerio for web scraping

## Features

- **Live Match**: Real-time updates of ongoing matches with detailed statistics
- **Upcoming Matches**: View the next scheduled matches
- **Points Table**: Complete standings with team statistics
- **Full Schedule**: Comprehensive match schedule with filtering options

## Setup Instructions

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

2. Run database migrations:
   ```bash
   npm run db:migrate
   ```

3. Run the scraping script to populate database:
   ```bash
   npm run scrape
   ```

4. Explore database with Prisma Studio (optional):
   ```bash
   npm run db:studio
   ```

## Data Sources

This application scrapes data from the official [IPL T20 website](https://www.iplt20.com) or uses fallback to dummy data if scraping fails.

## Project Structure

```
/frontend - React frontend components and pages
  /components - Reusable UI components
  /pages - App pages and routes
  /api - Service layer for API calls
  /types - TypeScript type definitions

/backend
  /prisma - Prisma schema and migrations
  /scripts - Data scraping scripts
  /data - SQLite database and dummy data
  /server.ts - Express server implementation
```

## Notes

- This application uses web scraping as a demonstration. In a production environment, you should consider using official APIs if available.
- The data refresh can be automated using cron jobs or similar scheduling mechanisms.
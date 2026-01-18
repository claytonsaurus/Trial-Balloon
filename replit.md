# Ghost News Scraper

## Overview
A web application that scrapes the internet for ghost and haunting news stories from various sources including Google News and Reddit. It aggregates, categorizes, and displays paranormal news in a searchable interface.

## Project Architecture

### Tech Stack
- **Backend**: Node.js with Express.js
- **Frontend**: Static HTML/CSS/JS served from `public/` folder
- **Scraping**: Axios for HTTP requests, Cheerio for HTML parsing
- **Scheduling**: node-cron for hourly auto-refresh

### File Structure
- `server.js` - Main Express server with API routes and scraping logic
- `public/index.html` - Frontend UI
- `package.json` - Dependencies and scripts

### Key Features
- Scrapes Google News RSS and Reddit for ghost/paranormal stories
- Filters out entertainment/media content (movies, TV shows, etc.)
- Categorizes hauntings by type (Poltergeist, Apparition, Demonic, etc.)
- Extracts location information from stories
- Calculates popularity scores
- Auto-refreshes every hour

### API Endpoints
- `GET /api/stories` - Get all stories (supports sortBy, filterType, filterLocation query params)
- `GET /api/refresh` - Manually refresh stories
- `GET /api/stats` - Get statistics about collected stories

## Running the App
The app runs on port 5000 and binds to 0.0.0.0 for Replit compatibility.

## Recent Changes
- 2026-01-18: Initial import and Replit environment setup

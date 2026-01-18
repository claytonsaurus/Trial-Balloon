# 👻 Ghost News Scraper

A web application that scrapes the internet for news stories about ghosts, hauntings, and paranormal activity. The app automatically refreshes every hour and provides manual refresh capabilities, along with intelligent categorization and organization of supernatural stories.

## Features

### Core Functionality
- **Automatic News Scraping**: Fetches ghost and haunting stories from multiple sources including:
  - Google News RSS feeds
  - Reddit paranormal communities (r/Paranormal, r/Ghosts, r/Thetruthishere)
- **Auto-Refresh**: Automatically updates every hour to fetch the latest stories
- **Manual Refresh**: On-demand refresh button for instant updates
- **Smart Summarization**: Automatically generates concise summaries of each story

### Organization & Categorization
- **Haunting Type Classification**: Stories are automatically categorized by type:
  - Poltergeist
  - Apparition
  - Residual Hauntings
  - Intelligent Hauntings
  - Demonic Activity
  - Spirit Encounters
  - Haunted Locations
- **Location Extraction**: Automatically detects and displays the location of each haunting
- **Popularity Scoring**: Each story receives a popularity score based on various factors

### User Interface Features
- **Beautiful Dark Theme**: Ghostly aesthetic with gradient effects
- **Advanced Filtering**:
  - Filter by haunting type
  - Filter by location
- **Multiple Sorting Options**:
  - Sort by date (newest first)
  - Sort by popularity
  - Sort by location
  - Sort by haunting type
- **Real-time Statistics**: View total stories, haunting types, and top locations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Auto-refresh Countdown**: Visual indicator showing time until next automatic update

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Trial-Balloon
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Usage

### Viewing Stories
- Stories are displayed as cards with the following information:
  - Title
  - Haunting type(s)
  - Location
  - Summary
  - Popularity score
  - Source
  - Link to read more

### Filtering Stories
1. **By Type**: Use the "Filter by Type" dropdown to show only specific haunting types
2. **By Location**: Enter a location in the search box to filter stories from that area
3. **Clear Filters**: Click "Clear Filters" to reset all filters

### Sorting Stories
Use the "Sort By" dropdown to organize stories by:
- **Date**: Most recent stories first (default)
- **Popularity**: Highest popularity score first
- **Location**: Alphabetically by location
- **Type**: Alphabetically by haunting type

### Refreshing Data
- **Manual Refresh**: Click the "🔄 Refresh Now" button to immediately fetch new stories
- **Automatic Refresh**: The app automatically refreshes every hour (countdown displayed in bottom-right corner)

## API Endpoints

The backend provides the following API endpoints:

### GET `/api/stories`
Retrieve all ghost stories with optional filtering and sorting.

**Query Parameters**:
- `sortBy`: `popularity` | `date` | `location` | `type`
- `filterType`: Filter by haunting type (e.g., "poltergeist")
- `filterLocation`: Filter by location (e.g., "New York")

**Response**:
```json
{
  "stories": [...],
  "lastUpdated": "2026-01-18T...",
  "total": 42
}
```

### GET `/api/refresh`
Manually trigger a refresh of all stories.

**Response**:
```json
{
  "success": true,
  "message": "Stories refreshed successfully",
  "total": 42,
  "lastUpdated": "2026-01-18T..."
}
```

### GET `/api/stats`
Get statistics about collected stories.

**Response**:
```json
{
  "totalStories": 42,
  "lastUpdated": "2026-01-18T...",
  "typeDistribution": { ... },
  "topLocations": [ ... ]
}
```

## Technical Details

### Architecture
- **Backend**: Node.js with Express
- **Web Scraping**: Axios for HTTP requests, Cheerio for HTML parsing
- **Scheduling**: node-cron for automatic hourly updates
- **Frontend**: Vanilla JavaScript with modern CSS

### Data Processing
1. **Scraping**: Fetches news from multiple sources in parallel
2. **Deduplication**: Removes duplicate stories based on title similarity
3. **Location Extraction**: Uses regex patterns to identify locations in story text
4. **Type Classification**: Keyword matching to categorize haunting types
5. **Summarization**: Extractive summarization using sentence extraction
6. **Popularity Scoring**: Multi-factor scoring based on:
   - Story length and detail
   - Presence of popular keywords
   - Location specificity

### Storage
- In-memory storage for fast access
- Stories are refreshed and replaced on each update

## Configuration

### Port
Default port is 3000. To change, set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

### Refresh Interval
The auto-refresh is set to every hour. To modify, edit the cron schedule in `server.js`:
```javascript
// Change '0 * * * *' to your desired schedule
// Format: minute hour day month weekday
cron.schedule('0 * * * *', () => {
  fetchGhostStories();
});
```

## Development

### Project Structure
```
Trial-Balloon/
├── server.js           # Backend server and scraping logic
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html     # Frontend UI
└── README.md          # This file
```

### Adding New Sources
To add additional news sources, modify the `fetchGhostStories()` function in `server.js`:
```javascript
async function fetchGhostStories() {
  const [source1, source2, yourNewSource] = await Promise.all([
    scrapeGoogleNews(),
    scrapeRedditStories(),
    scrapeYourNewSource() // Add your function here
  ]);
  // ...
}
```

## Troubleshooting

### No Stories Appearing
- Check your internet connection
- Some sources may be temporarily unavailable
- Try clicking "Refresh Now" to manually fetch stories

### Port Already in Use
If port 3000 is already in use, either:
- Stop the application using that port
- Use a different port: `PORT=8080 npm start`

### CORS Errors
The server includes CORS middleware to allow requests from any origin. If you encounter CORS errors, check your browser console for specific issues.

## Future Enhancements

Possible features for future versions:
- Save favorite stories
- Share stories on social media
- Email notifications for specific locations
- Historical archive of stories
- User comments and ratings
- Map view of haunting locations
- Advanced AI summarization using GPT
- Image scraping and display
- Video content integration

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Note**: This application scrapes publicly available news sources. Please ensure you comply with the terms of service of any websites you scrape and use the data responsibly.

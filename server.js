const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for stories
let ghostStories = [];
let lastUpdated = null;

// Haunting types for categorization
const hauntingTypes = {
  POLTERGEIST: ['poltergeist', 'objects moving', 'thrown', 'unexplained movement'],
  APPARITION: ['apparition', 'ghost sighting', 'figure', 'shadow person', 'phantom'],
  RESIDUAL: ['residual', 'repeating', 'same time', 'anniversary'],
  INTELLIGENT: ['intelligent', 'communication', 'responded', 'interactive'],
  DEMONIC: ['demonic', 'demon', 'evil', 'malevolent', 'possessed'],
  SPIRIT: ['spirit', 'presence', 'entity', 'supernatural'],
  HAUNTED_LOCATION: ['haunted house', 'haunted hotel', 'haunted building', 'haunted mansion']
};

// Extract location from text
function extractLocation(text) {
  // Common location patterns
  const locationPatterns = [
    /in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/,
    /at (?:the )?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] + (match[2] ? ', ' + match[2] : '');
    }
  }
  return 'Unknown Location';
}

// Categorize haunting type
function categorizeHaunting(text) {
  const lowerText = text.toLowerCase();
  const types = [];

  for (const [type, keywords] of Object.entries(hauntingTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      types.push(type.replace('_', ' '));
    }
  }

  return types.length > 0 ? types : ['General Haunting'];
}

// Summarize story (extractive summarization)
function summarizeStory(text, maxSentences = 3) {
  // Remove extra whitespace and split into sentences
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  // Take first few sentences as summary
  return sentences.slice(0, maxSentences).join('. ') + '.';
}

// Calculate popularity score based on various factors
function calculatePopularity(story) {
  let score = 0;

  // Longer descriptions might indicate more detailed/popular stories
  score += Math.min(story.description.length / 100, 50);

  // Certain keywords indicate popular story types
  const popularKeywords = ['famous', 'well-known', 'historic', 'legendary', 'most haunted'];
  const text = story.title.toLowerCase() + ' ' + story.description.toLowerCase();
  popularKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 20;
  });

  // Stories with specific locations might be more credible/popular
  if (story.location !== 'Unknown Location') score += 10;

  return Math.min(score, 100);
}

// Filter out entertainment/media content (movies, TV shows, books, games, etc.)
function isEntertainmentMedia(story) {
  const text = (story.title + ' ' + story.description).toLowerCase();

  // Keywords that indicate entertainment/media content
  const mediaKeywords = [
    // Movie/TV related
    'movie', 'film', 'trailer', 'cinema', 'box office', 'premiere',
    'tv show', 'television', 'series', 'episode', 'season', 'streaming',
    'netflix', 'hulu', 'amazon prime', 'disney+', 'hbo', 'paramount+',
    'actor', 'actress', 'director', 'starring', 'cast', 'screenplay',
    'production', 'filming', 'sequel', 'prequel', 'reboot', 'remake',

    // Book/Literature related
    'book', 'novel', 'author', 'bestseller', 'published', 'publisher',
    'chapter', 'reading', 'literature', 'fiction',

    // Video game related
    'video game', 'videogame', 'game', 'gaming', 'gamer', 'gameplay',
    'playstation', 'xbox', 'nintendo', 'steam', 'console',

    // Podcast/Audio related
    'podcast', 'podcaster', 'audio drama',

    // Theater/Performance
    'theater', 'theatre', 'play', 'performance', 'stage',

    // General entertainment
    'entertainment', 'review', 'critic', 'rating', 'rotten tomatoes',
    'imdb', 'metacritic', 'franchise', 'adaptation'
  ];

  // Check if any media keyword appears in the text
  const hasMediaKeyword = mediaKeywords.some(keyword => text.includes(keyword));

  // Additional patterns that suggest entertainment content
  const entertainmentPatterns = [
    /watch.*on/i,           // "watch it on Netflix"
    /coming to.*in 202\d/i, // "coming to theaters in 2024"
    /available on/i,        // "available on streaming"
    /releases? (?:on|in)/i, // "releases on Friday"
    /directed by/i,         // "directed by..."
    /written by/i,          // "written by..."
    /based on (?:the )?(?:book|novel)/i
  ];

  const matchesPattern = entertainmentPatterns.some(pattern => pattern.test(text));

  return hasMediaKeyword || matchesPattern;
}

// Scrape Google News for ghost stories
async function scrapeGoogleNews() {
  const searches = [
    'ghost sighting news',
    'haunted house news',
    'paranormal activity news',
    'poltergeist news',
    'supernatural occurrence'
  ];

  const stories = [];

  for (const query of searches) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data, { xmlMode: true });

      $('item').each((i, elem) => {
        const title = $(elem).find('title').text();
        const link = $(elem).find('link').text();
        const description = $(elem).find('description').text();
        const pubDate = $(elem).find('pubDate').text();

        if (title && link) {
          stories.push({
            id: Date.now() + Math.random(),
            title,
            link,
            description: description || title,
            pubDate: new Date(pubDate || Date.now()),
            source: 'Google News'
          });
        }
      });
    } catch (error) {
      console.error(`Error scraping ${query}:`, error.message);
    }
  }

  return stories;
}

// Scrape Reddit paranormal communities
async function scrapeRedditStories() {
  const stories = [];

  try {
    const subreddits = ['Paranormal', 'Ghosts', 'Thetruthishere'];

    for (const subreddit of subreddits) {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const posts = response.data.data.children;

      posts.forEach(post => {
        const data = post.data;
        if (data.title && !data.is_self) {
          stories.push({
            id: Date.now() + Math.random(),
            title: data.title,
            link: data.url.startsWith('http') ? data.url : `https://reddit.com${data.permalink}`,
            description: data.selftext || data.title,
            pubDate: new Date(data.created_utc * 1000),
            source: `r/${subreddit}`
          });
        }
      });
    }
  } catch (error) {
    console.error('Error scraping Reddit:', error.message);
  }

  return stories;
}

// Main function to fetch and process all stories
async function fetchGhostStories() {
  console.log('Fetching ghost stories...');

  try {
    const [googleStories, redditStories] = await Promise.all([
      scrapeGoogleNews(),
      scrapeRedditStories()
    ]);

    const allStories = [...googleStories, ...redditStories];

    // Filter out entertainment/media content first
    const realParanormalStories = allStories.filter(story => {
      const isMedia = isEntertainmentMedia(story);
      if (isMedia) {
        console.log(`FILTERED: ${story.title.substring(0, 80)}`);
      }
      return !isMedia;
    });
    const filteredCount = allStories.length - realParanormalStories.length;

    console.log(`Total stories found: ${allStories.length}`);
    if (filteredCount > 0) {
      console.log(`Filtered out ${filteredCount} entertainment/media stories`);
    } else {
      console.log('No entertainment/media stories detected to filter');
    }

    // Process each story
    ghostStories = realParanormalStories.map(story => {
      const fullText = `${story.title} ${story.description}`;
      const location = extractLocation(fullText);
      const types = categorizeHaunting(fullText);
      const summary = summarizeStory(story.description);

      return {
        ...story,
        location,
        hauntingTypes: types,
        summary,
        popularity: 0 // Will be calculated after all stories are processed
      };
    });

    // Calculate popularity scores
    ghostStories.forEach(story => {
      story.popularity = calculatePopularity(story);
    });

    // Remove duplicates based on similar titles
    const uniqueStories = [];
    const seenTitles = new Set();

    ghostStories.forEach(story => {
      const normalizedTitle = story.title.toLowerCase().substring(0, 50);
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueStories.push(story);
      }
    });

    ghostStories = uniqueStories;
    lastUpdated = new Date();

    console.log(`Fetched ${ghostStories.length} unique ghost stories`);
  } catch (error) {
    console.error('Error fetching stories:', error.message);
  }
}

// API Routes
app.get('/api/stories', (req, res) => {
  const { sortBy, filterType, filterLocation } = req.query;

  let filteredStories = [...ghostStories];

  // Filter by haunting type
  if (filterType) {
    filteredStories = filteredStories.filter(story =>
      story.hauntingTypes.some(type =>
        type.toLowerCase().includes(filterType.toLowerCase())
      )
    );
  }

  // Filter by location
  if (filterLocation) {
    filteredStories = filteredStories.filter(story =>
      story.location.toLowerCase().includes(filterLocation.toLowerCase())
    );
  }

  // Sort stories
  if (sortBy === 'popularity') {
    filteredStories.sort((a, b) => b.popularity - a.popularity);
  } else if (sortBy === 'date') {
    filteredStories.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  } else if (sortBy === 'location') {
    filteredStories.sort((a, b) => a.location.localeCompare(b.location));
  } else if (sortBy === 'type') {
    filteredStories.sort((a, b) =>
      a.hauntingTypes[0].localeCompare(b.hauntingTypes[0])
    );
  }

  res.json({
    stories: filteredStories,
    lastUpdated,
    total: filteredStories.length
  });
});

app.get('/api/refresh', async (req, res) => {
  await fetchGhostStories();
  res.json({
    success: true,
    message: 'Stories refreshed successfully',
    total: ghostStories.length,
    lastUpdated
  });
});

app.get('/api/stats', (req, res) => {
  const typeCount = {};
  const locationCount = {};

  ghostStories.forEach(story => {
    story.hauntingTypes.forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    locationCount[story.location] = (locationCount[story.location] || 0) + 1;
  });

  res.json({
    totalStories: ghostStories.length,
    lastUpdated,
    typeDistribution: typeCount,
    topLocations: Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }))
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Schedule automatic refresh every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled story refresh...');
  fetchGhostStories();
});

// Initial fetch on server start
fetchGhostStories();

app.listen(PORT, () => {
  console.log(`Ghost News Scraper running on http://localhost:${PORT}`);
  console.log('Auto-refresh scheduled every hour');
});

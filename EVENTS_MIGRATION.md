# Events-Based News System Migration

## Overview

This migration switches from fetching individual articles to fetching **events** that contain multiple related articles from different sources. This enables a "Ground News"-style comparison where users can see multiple perspectives on the same story.

## Key Changes

### 1. Database Schema Updates

**New Models:**
- `Event` - Represents a news story with multiple sources
- `EventArticle` - Junction table linking events to their articles

**Updated Models:**
- `Article` - Now has a relationship to events via `EventArticle`

### 2. News Client Changes

**Before:** Used `/article/getArticles` endpoint
**After:** Uses `/event/getEvents` and `/event/getEvent` endpoints

**New Methods:**
- `fetchEvents()` - Fetch events with their articles
- `fetchEventWithArticles()` - Fetch a specific event with all its articles
- `fetchIndianEvents()` - Fetch Indian events
- `fetchGlobalConflictEvents()` - Fetch global conflict events
- `fetchEventsByTopic()` - Fetch events by topic
- `fetchTrendingEvents()` - Fetch trending events

### 3. API Changes

**New Endpoint:** `/api/events`
- Supports filtering by topic, trending status
- Returns events with their related articles
- Includes pagination support

### 4. Frontend Components

**New Components:**
- `EventCard` - Displays an event with main article and alternative sources
- `EventsGrid` - Grid layout for displaying multiple events

**Updated:**
- Homepage now uses events-based approach
- Shows multiple sources per story

## How It Works

### Event Registry Events vs Articles

- **Articles** → 1 article, 1 source
- **Events** → 1 event, many related articles from different sources
- An "event" in Event Registry = all coverage of the same news story from various publishers, languages, and viewpoints

### Data Flow

1. **Cron Job** fetches events using `/event/getEvents`
2. **For each event**, fetches related articles using `/event/getEvent`
3. **Stores** events and articles in database with relationships
4. **Frontend** displays events with multiple sources

### Example Event Structure

```typescript
{
  id: "event_123",
  title: "Major Political Development",
  category: "Politics",
  summary: "Summary of the event...",
  articles: [
    {
      id: "article_1",
      title: "Left-leaning perspective",
      source: "Liberal News",
      url: "...",
      // ... other article fields
    },
    {
      id: "article_2", 
      title: "Right-leaning perspective",
      source: "Conservative News",
      url: "...",
      // ... other article fields
    },
    // ... more articles from different sources
  ]
}
```

## Benefits

1. **Multiple Perspectives** - Users can see different viewpoints on the same story
2. **Source Comparison** - Easy to compare coverage across outlets
3. **Better Context** - Events provide broader context than individual articles
4. **Reduced Bias** - Multiple sources help users form balanced opinions

## Migration Steps

1. **Run Database Migration:**
   ```bash
   npx prisma db push
   ```

2. **Update Cron Job:**
   The cron job now fetches events instead of individual articles

3. **Test the New System:**
   - Run the cron job manually: `POST /api/cron/update-articles`
   - Check the new events API: `GET /api/events`
   - Verify the homepage displays events correctly

## API Usage

### Fetch Events

```typescript
// Get trending events
const response = await fetch('/api/events?trending=true&limit=10')

// Get events by topic
const response = await fetch('/api/events?topic=politics&limit=10')

// Get all events with pagination
const response = await fetch('/api/events?limit=20&offset=0')
```

### Response Format

```typescript
{
  success: true,
  events: [
    {
      id: "event_id",
      title: "Event Title",
      category: "Politics",
      topic: "politics",
      isTrending: false,
      summary: "Event summary...",
      image: "image_url",
      publishedAt: "2024-01-01T00:00:00Z",
      articles: [
        // Array of related articles
      ]
    }
  ],
  total: 10
}
```

## Token Cost Considerations

- **Events endpoints** have higher token costs than article endpoints
- **Recommendation:** Reduce the number of events fetched per cron run
- **Current settings:** 10 events per topic (down from 20 articles)

## Troubleshooting

### Common Issues

1. **No events showing up:**
   - Check if cron job is running successfully
   - Verify Event Registry API key is valid
   - Check database for stored events

2. **Missing articles in events:**
   - Some events may have fewer articles than expected
   - This is normal - not all stories have multiple sources

3. **Performance issues:**
   - Events fetching is slower due to multiple API calls
   - Consider implementing caching for better performance

### Debug Commands

```bash
# Check database for events
npx prisma studio

# Test events API directly
curl "http://localhost:3000/api/events?limit=5"

# Run cron job manually
curl -X POST "http://localhost:3000/api/cron/update-articles"
```

## Future Enhancements

1. **Event Clustering** - Group similar events together
2. **Source Bias Analysis** - Analyze political leanings of sources
3. **User Preferences** - Allow users to filter by preferred sources
4. **Event Timeline** - Show how stories develop over time
5. **Related Events** - Suggest related events to users

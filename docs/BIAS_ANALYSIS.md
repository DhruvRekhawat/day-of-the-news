# Bias Analysis System

This document explains how the bias analysis system works in the Day of the News application.

## Overview

The bias analysis system automatically analyzes news articles for political bias using AI and displays the results in the UI. It uses a background job queue to process articles asynchronously, preventing timeouts in the main application.

## Architecture

### Components

1. **Prisma Schema**: New `BiasAnalysis` model linked to `Article`
2. **Background Job Queue**: Uses BullMQ with Redis for job processing
3. **AI Analysis Service**: OpenAI-powered bias analysis
4. **Worker Process**: Background process that handles bias analysis jobs
5. **UI Components**: React components for displaying bias information

### Data Flow

1. User requests homepage/events
2. API checks for existing bias analysis
3. If no analysis exists, queues a background job
4. Worker processes the job using AI analysis
5. Results are stored in the database
6. UI displays bias information with real-time updates

## Setup

### Prerequisites

- Redis server running (for job queue)
- OpenAI API key
- PostgreSQL database

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url

# Optional (defaults to localhost:6379)
REDIS_URL=redis://localhost:6379
```

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

3. Start the worker process:
   ```bash
   # Development
   pnpm worker:dev
   
   # Production
   pnpm worker
   ```

## Usage

### Starting the Worker

The bias analysis worker runs as a separate process:

```bash
# Development mode (with tsx)
pnpm worker:dev

# Production mode
pnpm worker
```

### Queue Management

The system automatically queues bias analysis jobs when:
- Articles are fetched without existing analysis
- Previous analysis failed
- Manual re-analysis is requested

### Job Priorities

- **High Priority**: Immediate processing (0 delay)
- **Normal Priority**: 5-second delay to prevent overwhelming

## API Endpoints

### Events API (`/api/events`)

Returns events with bias analysis data:

```json
{
  "success": true,
  "events": [
    {
      "id": "event_id",
      "title": "Event Title",
      "biasDistribution": {
        "LEFT": 3,
        "CENTER": 3,
        "RIGHT": 2,
        "PENDING": 1
      },
      "articles": [
        {
          "id": "article_id",
          "title": "Article Title",
          "biasAnalysis": {
            "biasDirection": "LEFT",
            "biasStrength": 4,
            "confidence": 0.85,
            "status": "COMPLETED"
          }
        }
      ]
    }
  ]
}
```

## UI Components

### BiasIndicator

Displays individual article bias with color coding:

```tsx
<BiasIndicator 
  biasAnalysis={article.biasAnalysis}
  showDetails={true}
/>
```

### EventBiasChart

Shows bias distribution for an entire event:

```tsx
<EventBiasChart 
  biasDistribution={event.biasDistribution}
/>
```

## Bias Categories

The system categorizes bias into 7 levels:

- **FAR_LEFT**: Extreme left-wing bias
- **LEFT**: Left-wing bias
- **CENTER_LEFT**: Slight left-wing bias
- **CENTER**: Balanced/neutral
- **CENTER_RIGHT**: Slight right-wing bias
- **RIGHT**: Right-wing bias
- **FAR_RIGHT**: Extreme right-wing bias

## Monitoring

### Queue Status

Check queue health:

```typescript
import { getQueueStatus } from '@/lib/queue';

const status = await getQueueStatus();
console.log(status);
// { waiting: 5, active: 2, completed: 100, failed: 3 }
```

### Worker Logs

The worker logs all operations:

```
[Worker] Starting bias analysis for article abc123
[Worker] Completed bias analysis for article abc123: LEFT
[Worker] Job job123 completed successfully
```

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Ensure Redis is running
   - Check REDIS_URL environment variable
   - Test connection: `pnpm redis:test`
   - For local development: `redis-server` or `docker run -d -p 6379:6379 redis:alpine`

2. **BullMQ Redis Configuration Errors**
   - Ensure `maxRetriesPerRequest: null` in Redis options
   - Use compatible versions: BullMQ v4.x with ioredis v5.x
   - Test Redis connection before starting worker

3. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is set
   - Check API quota and billing

4. **Worker Not Processing Jobs**
   - Ensure worker process is running
   - Check Redis connection
   - Verify job queue is receiving jobs
   - Check worker logs for errors

### Debug Mode

Enable detailed logging by setting:

```bash
DEBUG=bullmq:*
```

## Performance

### Optimization Tips

1. **Concurrency**: Adjust worker concurrency based on OpenAI rate limits
2. **Batch Processing**: Process multiple articles in batches
3. **Caching**: Use Redis for caching analysis results
4. **Rate Limiting**: Implement delays between API calls

### Scaling

- Run multiple worker instances
- Use Redis cluster for high availability
- Implement job prioritization
- Add monitoring and alerting

## Security

- OpenAI API keys are stored securely
- No sensitive data is logged
- Rate limiting prevents API abuse
- Job queue is isolated from main application

## Future Enhancements

- Manual bias classification interface
- Bias trend analysis over time
- Source reliability scoring
- User bias preference settings
- Bias comparison tools

import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

// Redis connection
export const redis = new Redis(process.env.REDIS_URL || 'redis://default:5SLcml83NRqHXYspNYJ0isyRAaMxG64F@redis-19794.c89.us-east-1-3.ec2.redns.redis-cloud.com:19794', {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
});

// Create queues
export const biasAnalysisQueue = new Queue('bias-analysis', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});


// Add bias analysis job
export async function queueBiasAnalysis(articleId: string, priority: 'high' | 'normal' = 'normal') {
  const jobOptions = {
    priority: priority === 'high' ? 1 : 2,
    delay: priority === 'high' ? 0 : 5000, // High priority jobs start immediately
  };
  
  await biasAnalysisQueue.add('analyze-bias', { articleId }, jobOptions);
}

// Get queue status
export async function getQueueStatus() {
  const waiting = await biasAnalysisQueue.getWaiting();
  const active = await biasAnalysisQueue.getActive();
  const completed = await biasAnalysisQueue.getCompleted();
  const failed = await biasAnalysisQueue.getFailed();
  
  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
  };
}

// Clean up completed jobs
export async function cleanupCompletedJobs() {
  await biasAnalysisQueue.clean(1000 * 60 * 60 * 24, 0, 'completed'); // Clean jobs older than 24 hours
  await biasAnalysisQueue.clean(1000 * 60 * 60 * 24, 0, 'failed');
}
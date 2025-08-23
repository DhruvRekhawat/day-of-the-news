import { Worker } from 'bullmq';
import { prisma } from '@/lib/prisma';
import { analyzeArticleBias, getQuickBiasEstimate } from '@/lib/ai-bias';
import { redis } from '@/lib/queue';

const worker = new Worker('bias-analysis', async (job) => {
  const { articleId } = job.data;
  
  try {
    console.log(`[Worker] Starting bias analysis for article ${articleId}`);
    
    // Update status to processing
    await prisma.biasAnalysis.upsert({
      where: { articleId },
      update: { 
        status: 'PROCESSING',
        updatedAt: new Date()
      },
      create: {
        articleId,
        status: 'PROCESSING',
        biasDirection: 'UNKNOWN',
        biasStrength: 3,
        confidence: 0.0,
        reasoning: 'Processing...'
      }
    });
    
    // Fetch the article
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });
    
    if (!article) {
      throw new Error(`Article ${articleId} not found`);
    }
    
    // Try AI analysis first
    let analysis;
    try {
      analysis = await analyzeArticleBias(article);
    } catch (aiError) {
      console.warn(`[Worker] AI analysis failed for article ${articleId}, using quick estimate`);
      // Fall back to quick estimation
      const quickEstimate = getQuickBiasEstimate(article.source);
      analysis = {
        biasDirection: quickEstimate.biasDirection || 'UNKNOWN',
        biasStrength: quickEstimate.biasStrength || 3,
        confidence: quickEstimate.confidence || 0.3,
        reasoning: quickEstimate.reasoning || 'Quick estimate due to AI analysis failure'
      };
    }
    
    // Save the analysis
    await prisma.biasAnalysis.upsert({
      where: { articleId },
      update: {
        biasDirection: analysis.biasDirection,
        biasStrength: analysis.biasStrength,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        status: 'COMPLETED',
        processedAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        articleId,
        biasDirection: analysis.biasDirection,
        biasStrength: analysis.biasStrength,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        status: 'COMPLETED',
        processedAt: new Date()
      }
    });
    
    console.log(`[Worker] Completed bias analysis for article ${articleId}: ${analysis.biasDirection}`);
    
  } catch (error) {
    console.error(`[Worker] Bias analysis failed for article ${articleId}:`, error);
    
    // Update status to failed
    await prisma.biasAnalysis.upsert({
      where: { articleId },
      update: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      },
      create: {
        articleId,
        status: 'FAILED',
        biasDirection: 'UNKNOWN',
        biasStrength: 3,
        confidence: 0.0,
        reasoning: 'Analysis failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    throw error;
  }
}, {
  connection: redis,
  concurrency: 2, // Process 2 jobs at a time
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  stalledInterval: 30000, // Check for stalled jobs every 30 seconds
});

// Handle worker events
worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err);
});

console.log('[Worker] Bias analysis worker started');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Worker] Shutting down gracefully...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Worker] Shutting down gracefully...');
  await worker.close();
  process.exit(0);
});

export default worker;

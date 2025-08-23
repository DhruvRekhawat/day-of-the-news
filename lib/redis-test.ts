import { Redis } from 'ioredis';

export async function testRedisConnection() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://default:5SLcml83NRqHXYspNYJ0isyRAaMxG64F@redis-19794.c89.us-east-1-3.ec2.redns.redis-cloud.com:19794', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  try {
    // Test basic connection
    await redis.ping();
    console.log('✅ Redis connection successful');
    
    // Test basic operations
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    await redis.del('test-key');
    
    if (value === 'test-value') {
      console.log('✅ Redis read/write operations successful');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  } finally {
    await redis.quit();
  }
}

// Run test if called directly
if (require.main === module) {
  testRedisConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

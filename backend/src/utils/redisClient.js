import { createClient } from 'redis';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || null;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

// Node Redis client (for simple get/set operations)
export const nodeRedisClient = createClient(
  REDIS_URL ? { url: REDIS_URL } : undefined
);

nodeRedisClient.on('connect', () => console.log('🟢 node-redis connected'));
nodeRedisClient.on('error', (err) => console.error('🔴 node-redis error:', err));

export async function connectNodeRedis() {
  if (!nodeRedisClient.isOpen) {
    await nodeRedisClient.connect();
  }
}

// ioredis client (for bullmq and advanced features)
export const ioRedis = REDIS_URL
  ? new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
  : new IORedis({ host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null });

ioRedis.on('connect', () => console.log('🟢 ioredis connected'));
ioRedis.on('error', (err) => console.error('🔴 ioredis error:', err));

export default {
  nodeRedisClient,
  connectNodeRedis,
  ioRedis,
};

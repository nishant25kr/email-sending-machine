Redis setup for this project

Environment variables (add to .env):

- REDIS_URL: Optional. If provided, used for both node-redis and ioredis clients (e.g. redis://:password@host:port)
- REDIS_HOST: Fallback host when REDIS_URL is not provided (default: 127.0.0.1)
- REDIS_PORT: Fallback port when REDIS_URL is not provided (default: 6379)

Notes:
- The project uses two Redis clients intentionally:
  - `node-redis` (exported as `nodeRedisClient`) for general-purpose get/set operations.
  - `ioredis` (exported as `ioRedis`) for BullMQ queues and worker connections.
- Both clients are created and configured in `src/utils/redisClient.js` and should be reused across the codebase.

How to run locally with Docker (Redis):

1. Start a Redis container:

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

2. Add `REDIS_HOST=127.0.0.1` and `REDIS_PORT=6379` to backend/.env (or set `REDIS_URL`).

3. Start the backend:

```bash
cd backend
npm run dev
```

Troubleshooting:
- If workers/queues fail to connect, ensure the same Redis instance is reachable and that `.env` is loaded (the backend uses `dotenv`).
- Check logs for `ioredis connected` or `node-redis connected`.

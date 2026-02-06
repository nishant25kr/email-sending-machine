// src/test.queue.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const redis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
});

const queue = new Queue("email-queue", {
  connection: redis,
});

await queue.add(
  "send-email",
  { to: "docker@test.com" },
  { delay: 2000 }
);

console.log("📨 Job added via Docker Redis");
process.exit(0);


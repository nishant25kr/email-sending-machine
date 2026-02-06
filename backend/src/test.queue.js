// src/test.queue.js
import { Queue } from "bullmq";
import { ioRedis } from "./queues/redis.js";

const queue = new Queue("email-queue", {
  connection: ioRedis,
});

await queue.add(
  "send-email",
  { to: "docker@test.com" },
  { delay: 2000 }
);

console.log("📨 Job added via Docker Redis");
process.exit(0);


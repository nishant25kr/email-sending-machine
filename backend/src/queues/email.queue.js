import { Queue } from "bullmq";
import { ioRedis } from "../utils/redisClient.js";

export const emailQueue = new Queue("email-queue", {
  connection: ioRedis,
});

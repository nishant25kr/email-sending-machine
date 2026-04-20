import { prisma } from "../db/prisma.js";
import { emailQueue } from "../queues/email.queue.js";

async function cleanup() {
  try {
    console.log("🧹 Starting cleanup...");

    // 1. Clear BullMQ queue
    try {
      console.log("📥 Clearing email queue...");
      await emailQueue.obliterate({ force: true });
      console.log("✅ Queue cleared.");
    } catch (redisErr) {
      console.error("⚠️ Failed to clear Redis queue (check REDIS_URL):", redisErr.message);
    }

    // 2. Clear Database
    console.log("🗄️ Clearing database records...");
    
    // Delete Emails first (referencing Batches)
    const deletedEmails = await prisma.email.deleteMany({});
    console.log(`✅ Deleted ${deletedEmails.count} email records.`);

    // Delete Batches
    const deletedBatches = await prisma.emailBatch.deleteMany({});
    console.log(`✅ Deleted ${deletedBatches.count} email batch records.`);

    console.log("✨ Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();

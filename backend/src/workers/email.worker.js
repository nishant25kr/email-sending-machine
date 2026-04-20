import { Worker } from "bullmq";
import { ioRedis } from "../utils/redisClient.js";
import nodemailer from "nodemailer";
import { prisma } from "../db/prisma.js";
import { getTransporter } from "../services/email.service.js";
import { getCurrentHourKey, msUntilNextHour } from "../utils/rateLimiter.js";
import { emailQueue } from "../queues/email.queue.js";

const redis = ioRedis;

const MAX_PER_HOUR = Number(process.env.MAX_EMAILS_PER_HOUR || 100);
const MIN_DELAY = Number(process.env.MIN_DELAY_BETWEEN_EMAILS_MS || 2000);

new Worker(
  "email-queue",
  async (job) => {
    const { emailId } = job.data;

    const email = await prisma.email.findUnique({
      where: { id: emailId },
      include: { batch: true },
    });

    if (!email) return;

    const sender = "default_sender";

    const rateKey = getCurrentHourKey(sender);
    const count = await redis.incr(rateKey);

    if (count === 1) {
      await redis.expire(rateKey, 3600);
    }

    if (count > MAX_PER_HOUR) {
      const delay = msUntilNextHour();

      console.log(`⏳ Rate limit hit. Rescheduling ${email.toEmail}`);

      await emailQueue.add(
        "send-email",
        { emailId },
        {
          delay,
          jobId: `email:${emailId}`,
        }
      );

      return; // IMPORTANT: stop execution
    }

    /* ---------------- SEND EMAIL ---------------- */

    try {
      const transporter = await getTransporter();

      const info = await transporter.sendMail({
        from: '"ReachInbox" <no-reply@reachinbox.com>',
        to: email.toEmail,
        subject: email.batch.subject,
        text: email.batch.body,
      });

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });

      console.log("✅ Sent:", email.toEmail);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("🔗 Preview:", previewUrl);
      } else {
        console.log("📬 Email delivered to inbox.");
      }

      /* --------- MIN DELAY BETWEEN EMAILS --------- */
      await new Promise((r) => setTimeout(r, MIN_DELAY));

    } catch (err) {
      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "failed",
          error: err.message,
        },
      });

      throw err;
    }
  },
  {
    connection: redis,
    concurrency: 2,
  }
);

console.log("🚀 Email worker running");

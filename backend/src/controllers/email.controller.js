import { prisma } from "../db/prisma.js";
import { emailQueue } from "../queues/email.queue.js";

/**
 * GET /api/emails/scheduled
 */
export async function getScheduledEmails(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where: { status: "scheduled" },
        include: {
          batch: {
            select: { subject: true },
          },
        },
        orderBy: { scheduledAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.email.count({
        where: { status: "scheduled" },
      }),
    ]);

    res.json({
      data: emails.map((e) => ({
        id: e.id,
        email: e.toEmail,
        subject: e.batch.subject,
        scheduledAt: e.scheduledAt,
        status: e.status,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scheduled emails" });
  }
}

/**
 * GET /api/emails/sent
 */
export async function getSentEmails(req, res) {

  // console.log("Prisma keys:", Object.keys(prisma));


  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where: {
          status: { in: ["sent", "failed"] },
        },
        include: {
          batch: {
            select: { subject: true },
          },
        },
        orderBy: { sentAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.email.count({
        where: {
          status: { in: ["sent", "failed"] },
        },
      }),
    ]);

    res.json({
      data: emails.map((e) => ({
        id: e.id,
        email: e.toEmail,
        subject: e.batch.subject,
        sentAt: e.sentAt,
        status: e.status,
        error: e.error,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
}

/**
 * POST /api/emails/schedule
 */
export async function scheduleEmails(req, res) {
  try {
    // console.log("Scheduling emails with body:", req.body);
    const {
      subject,
      body,
      emails,
      startTime,
      delaySeconds,
      hourlyLimit,
    } = req.body;

    if (!subject || !body || !emails?.length || !startTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const safeDelaySeconds = Number(delaySeconds) || 0;
    const safeHourlyLimit = Number(hourlyLimit) || 100;

    const batch = await prisma.emailBatch.create({
      data: {
        subject,
        body,
        startTime: new Date(startTime),
        delaySeconds: safeDelaySeconds,
        hourlyLimit: safeHourlyLimit,
      },
    });

    let delay = 0;
    const emailRecords = [];

    for (const toEmail of emails) {
      const scheduledAt = new Date(
        new Date(startTime).getTime() + delay * 1000
      );

      const email = await prisma.email.create({
        data: {
          batchId: batch.id,
          toEmail,
          scheduledAt,
          status: "scheduled",
        },
      });

      emailRecords.push(email);

      await emailQueue.add(
        "send-email",
        { emailId: email.id },
        {
          delay: scheduledAt.getTime() - Date.now(),
          jobId: email.id,
        }
      );

      delay += delaySeconds;
    }

    res.json({
      success: true,
      batchId: batch.id,
      emailsScheduled: emailRecords.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to schedule emails" });
  }
}
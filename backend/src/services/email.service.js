import nodemailer from "nodemailer";

let transporterPromise = null;

export async function getTransporter() {
  if (!transporterPromise) {
    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.ethereal.email") {
      // Use real SMTP settings
      transporterPromise = Promise.resolve(
        nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465, // Use SSL for port 465
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      );
    } else {
      // Fallback to Ethereal for testing
      transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
        nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        })
      );
    }
  }

  return transporterPromise;
}

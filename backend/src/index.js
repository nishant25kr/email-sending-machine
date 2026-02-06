import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClient } from "redis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

/* =======================
   REDIS SETUP (SINGLE CLIENT)
======================= */
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
    console.log("🟢 Redis connected");
});

redisClient.on("error", (err) => {
    console.error("🔴 Redis error:", err);
});

/* =======================
   ROUTES
======================= */

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Email Scheduler" });
});

// Auth routes
app.post("/api/auth/login", (req, res) => {
    res.json({ message: "Login successful" });
});

app.post("/api/auth/register", (req, res) => {
    res.json({ message: "Register successful" });
});

// Email routes
app.post("/api/emails/schedule", async (req, res) => {
    const { email, time } = req.body;

    if (!email || !time) {
        return res.status(400).json({ message: "Email and time required" });
    }

    await redisClient.set(
        `email:${email}`,
        JSON.stringify({ email, time })
    );

    res.json({ message: "Email scheduled successfully" });
});

/* =======================
   SERVER START
======================= */
async function startServer() {
    try {
        await redisClient.connect();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

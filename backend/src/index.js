import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectNodeRedis } from "./utils/redisClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";


app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Email Scheduler" });
});

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

async function startServer() {
    try {
        await connectNodeRedis();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

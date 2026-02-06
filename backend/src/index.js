import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));



const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

app.get("/health", (req, res) => {
  res.json({ message: "Welcome to email scheduler" });
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

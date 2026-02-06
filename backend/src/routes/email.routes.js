import express from "express";
import {
  getScheduledEmails,
  getSentEmails,
  scheduleEmails,
} from "../controllers/email.controller.js";

const router = express.Router();

// existing POST /schedule stays here
router.post("/schedule", scheduleEmails);

router.get("/scheduled", getScheduledEmails);
router.get("/sent", getSentEmails);

export default router;

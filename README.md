📧 ReachInbox – Full-Stack Email Scheduler

A production-grade email scheduling system built using Node.js, Express, BullMQ, Redis, PostgreSQL, and React, designed to reliably schedule and send emails at scale without using cron jobs.

This project simulates a core component of ReachInbox’s infrastructure: persistent email scheduling, rate-limited delivery, and dashboard-based monitoring.

🚀 Features
Backend

Schedule emails at a specific future time

Persistent job scheduling using BullMQ + Redis

No cron jobs

Email sending via Ethereal SMTP

Survives server restarts (jobs are not lost or duplicated)

Rate limiting (emails/hour)

Configurable delay between emails

Handles high load (1000+ scheduled emails)

Separate API server and worker process

PostgreSQL persistence using Prisma ORM

Google OAuth authentication

Frontend

React dashboard (JavaScript)

Google OAuth login

Compose email modal

CSV / TXT email upload

View Scheduled Emails

View Sent Emails

Status badges and timestamps

Clean UI inspired by provided Figma

🧠 Architecture Overview
Frontend (React)
   ↓
Backend API (Express)
   ↓
PostgreSQL (Email + Batch storage)
   ↓
BullMQ Queue (Redis)
   ↓
Background Worker
   ↓
SMTP (Ethereal Email)

Key Design Decisions

BullMQ delayed jobs instead of cron

Redis-backed counters for rate limiting

Idempotent job IDs to avoid duplicate sends

Separate worker service for scalability

Managed Redis & PostgreSQL in production

🛠 Tech Stack
Backend

Node.js (ES Modules)

Express.js

BullMQ

Redis

PostgreSQL

Prisma ORM

Ethereal Email (SMTP)

Google OAuth

JWT Authentication

Frontend

React (JavaScript)

Tailwind CSS

Axios

Infra

Docker

Render (Web Service + Background Worker)

📂 Project Structure
email-sending-machine/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── workers/
│   │   ├── db/
│   │   └── server.js
│   ├── prisma/
│   ├── Dockerfile
│   ├── Dockerfile.worker
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── package.json
│
└── README.md

⚙️ Environment Variables
Backend (.env)
PORT=3000

DATABASE_URL=postgresql://user:password@host:5432/db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=xxxx
SMTP_PASS=xxxx

EMAIL_RATE_LIMIT_PER_HOUR=200
EMAIL_SEND_DELAY_SECONDS=2


⚠️ .env is ignored via .gitignore

▶️ Running Locally
1️⃣ Start Redis
docker run -d -p 6379:6379 redis

2️⃣ Start PostgreSQL
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_USER=reachinbox \
  -e POSTGRES_PASSWORD=reachinbox \
  -e POSTGRES_DB=reachinbox \
  postgres:15

3️⃣ Install Backend Dependencies
cd backend
npm install

4️⃣ Run Prisma Migrations
npx prisma migrate dev
npx prisma generate

5️⃣ Start Backend API
npm run start

6️⃣ Start Worker (separate terminal)
npm run worker

7️⃣ Start Frontend
cd frontend
npm install
npm run dev


Frontend: http://localhost:5173
Backend: http://localhost:3000

🧪 API Endpoints
Schedule Emails
POST /api/emails/schedule

Fetch Scheduled Emails
GET /api/emails/scheduled

Fetch Sent Emails
GET /api/emails/sent

Google Auth
POST /api/auth/google

⏱ Rate Limiting Strategy

Configurable hourly limit (EMAIL_RATE_LIMIT_PER_HOUR)

Redis-backed counters (hour_window + sender)

When limit is exceeded:

Job is delayed, not dropped

Rescheduled to next available window

Safe across multiple workers
# EtharaBoard

EtharaBoard is a full-stack team task manager where admins create projects, manage teams, assign tasks, and track project health while members focus on assigned work and status updates.

## Submission

- GitHub repo: https://github.com/SarthakYadava/Ethara_Ai
- Live URL: Add the Railway production URL here after deployment.

## Features

- Signup and login with JWT authentication
- Admin/member role-based access control
- Project creation and team membership management
- Task creation, assignment, priority, due dates, and status tracking
- Dashboard metrics for completion, overdue tasks, blocked work, and workload
- Modular REST API and feature-based React frontend

## Stack

- React + Vite + React Router
- Node.js + Express
- PostgreSQL + Prisma
- Zod validation
- Railway deployment

## Local Setup

```bash
npm install
cp .env.example apps/api/.env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The API runs on `http://localhost:4000` and the web app runs on `http://localhost:5173`.

## Demo Accounts

After running the seed command:

- Admin: `admin@demo.com` / `Admin@123`
- Member: `member@demo.com` / `Member@123`

If the database is empty and seed data is not used, the first signup becomes an admin.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:projectId/members`
- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:taskId/status`
- `GET /api/dashboard`
- `GET /api/dashboard/projects/:projectId`

## Railway Deployment

1. Create a Railway project from this GitHub repo.
2. Add a Railway PostgreSQL database.
3. Set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.
4. Railway uses `npm run build` and `npm start`.
5. `npm start` runs `prisma migrate deploy` before starting the API server.

If deploying from the CLI:

```bash
npx @railway/cli login
npx @railway/cli link
npx @railway/cli up
```

For demo data on Railway, run:

```bash
npx @railway/cli run npm run db:seed
```

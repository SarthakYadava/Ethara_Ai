# Team Task Manager

A full-stack team task manager with authentication, project management, task assignment, status tracking, and role-based access.

## Stack

- React + Vite
- Node.js + Express
- PostgreSQL + Prisma
- JWT authentication

## Local Setup

```bash
npm install
cp .env.example apps/api/.env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Demo Accounts

Seed data will create demo admin and member accounts once the database is configured.

## Deployment

The app is designed for Railway with PostgreSQL. Set the environment variables from `.env.example`, run Prisma migrations, and start the production server with `npm start`.

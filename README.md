# Striking

Measure your reading like you measure your runs. A PWA to track your pages per minute, manage your library, and share your streaks with friends.

## Tech Stack
- **Database**: PostgreSQL
- **Backend**: Node.js + Express + TypeScript + `pg` + JWT
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Chart.js

## Quickstart

### 1. Start the Database
The project uses Docker Compose to run a local PostgreSQL database instance.
```bash
docker-compose up -d
```

### 2. Start the Backend
The backend runs on port 5000. It will automatically initialize the database schema on first boot.
```bash
cd backend
npm install
npm run dev
```

### 3. Start the Frontend
The frontend runs on Vite's default port (usually 5173).
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Manual Book Entry**: Add books to your library to track progress.
- **Live Session Timer**: Time your reading sessions and track the starting and ending pages.
- **PPM Calculation**: Automatically calculates Pages Per Minute based on your live session.
- **Activity Feed**: View chronological reading updates in the social feed.
- **Stats Dashboard**: View your reading speed over the last 7 days and lifetime metrics.

## License
MIT

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, getMe, updateMe } from './controllers/authController';
import { getBooks, createBook, getUserBooks, addUserBook, updateUserBook } from './controllers/booksController';
import { startSession, finishSession, getSessions, getStats, getFeed } from './controllers/sessionsController';
import { authMiddleware } from './middlewares/auth';
import pool from './db';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Init DB
const initDb = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf-8');
    await pool.query(schema);
    console.log('Database initialized');
  } catch (e) {
    console.error('Error initializing database', e);
  }
};
initDb();

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Protected Routes
app.use('/api', authMiddleware);

app.get('/api/users/me', getMe);
app.patch('/api/users/me', updateMe);

app.get('/api/books', getBooks);
app.post('/api/books', createBook);

app.get('/api/user-books', getUserBooks);
app.post('/api/user-books', addUserBook);
app.patch('/api/user-books/:id', updateUserBook);

app.post('/api/sessions/start', startSession);
app.post('/api/sessions/finish', finishSession);
app.get('/api/sessions', getSessions);

app.get('/api/stats', getStats);
app.get('/api/feed', getFeed);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;

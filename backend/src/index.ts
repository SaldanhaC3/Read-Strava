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

const apiRouter = express.Router();

// Auth Routes
apiRouter.post('/auth/register', register);
apiRouter.post('/auth/login', login);

// Protected Routes
apiRouter.use(authMiddleware);

apiRouter.get('/users/me', getMe);
apiRouter.patch('/users/me', updateMe);

apiRouter.get('/books', getBooks);
apiRouter.post('/books', createBook);

apiRouter.get('/user-books', getUserBooks);
apiRouter.post('/user-books', addUserBook);
apiRouter.patch('/user-books/:id', updateUserBook);

apiRouter.post('/sessions/start', startSession);
apiRouter.post('/sessions/finish', finishSession);
apiRouter.get('/sessions', getSessions);

apiRouter.get('/stats', getStats);
apiRouter.get('/feed', getFeed);

// Mount router on /api for local dev and / for Vercel
app.use('/api', apiRouter);
app.use('/', apiRouter);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;

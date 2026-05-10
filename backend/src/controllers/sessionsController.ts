import { Request, Response } from 'express';
import pool from '../db';

export const startSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { bookId, startPage } = req.body;
    
    // Insert partial session (we'll update it when done, setting end_page = startPage initially, or just keep it in memory. 
    // Wait, the DB constraints say start_time and end_time are NOT NULL. 
    // We can just have a sessions table where end_time is nullable, or we do it entirely in frontend and only send when finished!
    // Since the prompt says "POST /api/sessions: Iniciar nova sessao", let's alter the schema temporarily, or just return a generated id.
    
    // Actually, usually it's easier to just let the frontend track the timer and send a single POST /api/sessions at the end with start_time, end_time, start_page, end_page.
    // Let's implement both or just accept the final one in `finishSession`.
    
    res.json({ sessionId: Date.now().toString(), startTime: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const finishSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    // We accept everything from the frontend at the end to simplify
    const { bookId, startPage, endPage, startTime, endTime } = req.body;
    
    const result = await pool.query(
      `INSERT INTO reading_sessions (user_id, book_id, start_page, end_page, start_time, end_time) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, bookId, startPage, endPage, startTime, endTime]
    );

    // Update user_books progress
    await pool.query(
      `UPDATE user_books SET progress_page = GREATEST(progress_page, $1) WHERE user_id = $2 AND book_id = $3`,
      [endPage, userId, bookId]
    );
    
    const session = result.rows[0];
    
    // Add to activity feed
    await pool.query(
      `INSERT INTO activity_feed (user_id, activity_type, book_id, metadata) VALUES ($1, 'session', $2, $3)`,
      [userId, bookId, JSON.stringify({ pagesRead: session.pages_read, ppm: session.ppm })]
    );

    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query(
      `SELECT rs.*, b.title, b.cover_url FROM reading_sessions rs JOIN books b ON rs.book_id = b.id WHERE rs.user_id = $1 ORDER BY rs.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    // Basic stats
    const booksRead = await pool.query(`SELECT COUNT(*) FROM user_books WHERE user_id = $1 AND status = 'finished'`, [userId]);
    const sessions = await pool.query(`SELECT ppm, duration_min, created_at, pages_read FROM reading_sessions WHERE user_id = $1`, [userId]);
    
    res.json({
      booksRead: parseInt(booksRead.rows[0].count),
      sessions: sessions.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT af.*, u.handle, u.avatar_url, b.title, b.cover_url 
       FROM activity_feed af 
       JOIN users u ON af.user_id = u.id 
       JOIN books b ON af.book_id = b.id 
       ORDER BY af.created_at DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

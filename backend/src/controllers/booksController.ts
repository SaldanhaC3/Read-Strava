import { Request, Response } from 'express';
import pool from '../db';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 50');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { isbn, title, author, cover_url, publisher, published_year, page_count } = req.body;
    const result = await pool.query(
      'INSERT INTO books (isbn, title, author, cover_url, publisher, published_year, page_count) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [isbn, title, author, cover_url, publisher, published_year, page_count]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query(
      `SELECT ub.id as user_book_id, b.*, ub.status, ub.progress_page, ub.rating, ub.review 
       FROM user_books ub 
       JOIN books b ON ub.book_id = b.id 
       WHERE ub.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addUserBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { bookId } = req.body;
    const result = await pool.query(
      'INSERT INTO user_books (user_id, book_id) VALUES ($1, $2) RETURNING *',
      [userId, bookId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params; // user_book.id
    const { status, progress_page, rating, review } = req.body;
    
    // Set finished_at if status changes to finished
    let finished_at_clause = '';
    if (status === 'finished') {
      finished_at_clause = `, finished_at = now()`;
    }

    const result = await pool.query(
      `UPDATE user_books SET 
        status = COALESCE($1, status), 
        progress_page = COALESCE($2, progress_page), 
        rating = COALESCE($3, rating), 
        review = COALESCE($4, review)
        ${finished_at_clause}
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [status, progress_page, rating, review, id, userId]
    );
    
    if (status === 'finished' && result.rows.length > 0) {
      await pool.query(
        `INSERT INTO activity_feed (user_id, activity_type, book_id, metadata) VALUES ($1, 'finish', $2, $3)`,
        [userId, result.rows[0].book_id, JSON.stringify({ rating })]
      );
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

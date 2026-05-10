import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, handle } = req.body;
    
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR handle = $2', [email, handle]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or handle' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, name, handle) VALUES ($1, $2, $3, $4) RETURNING id, name, handle, avatar_url, bio, theme_palette, theme_font',
      [email, password_hash, name, handle]
    );

    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });
    
    // Remove password_hash before sending
    delete user.password_hash;
    
    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userResult = await pool.query('SELECT id, name, email, handle, avatar_url, bio, theme_palette, theme_font FROM users WHERE id = $1', [userId]);
    res.json(userResult.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { bio, avatar_url, theme_palette, theme_font } = req.body;
    
    const userResult = await pool.query(
      `UPDATE users SET bio = COALESCE($1, bio), avatar_url = COALESCE($2, avatar_url), theme_palette = COALESCE($3, theme_palette), theme_font = COALESCE($4, theme_font) WHERE id = $5 RETURNING id, name, handle, avatar_url, bio, theme_palette, theme_font`,
      [bio, avatar_url, theme_palette, theme_font, userId]
    );
    res.json(userResult.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

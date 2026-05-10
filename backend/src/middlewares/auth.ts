import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const scheme = parts[0] as string;
  const token = parts[1] as string;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, SECRET, (err: any, decoded: any) => {
    if (err) return res.status(401).json({ error: 'Token invalid' });

    (req as any).userId = decoded.id;
    return next();
  });
};

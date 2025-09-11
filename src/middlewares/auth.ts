import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token de acesso requerido' });
    return;
  }

  jwt.verify(token, config.jwt.secret, (err: any, decoded: any) => {
    if (err) {
      logger.warn('Token inválido tentativa de acesso', { token, error: err.message });
      res.status(403).json({ error: 'Token inválido' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  });
};

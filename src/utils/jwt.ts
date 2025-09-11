import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '7d', // Hard-coded for now to avoid type issues
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

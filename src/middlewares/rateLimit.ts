import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class MemoryStore {
  private store: RateLimitStore = {};

  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store[key];
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    this.store[key] = value;
  }

  delete(key: string): void {
    delete this.store[key];
  }

  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key];
      }
    });
  }
}

export const createRateLimit = (options: RateLimitOptions) => {
  const store = new MemoryStore();
  
  // Cleanup expired entries every minute
  setInterval(() => store.cleanup(), 60000);

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    let record = store.get(key);

    // Reset if window has passed
    if (!record || record.resetTime <= now) {
      record = {
        count: 0,
        resetTime: now + options.windowMs,
      };
    }

    record.count++;
    store.set(key, record);

    // Set headers
    res.set({
      'X-RateLimit-Limit': options.max.toString(),
      'X-RateLimit-Remaining': Math.max(0, options.max - record.count).toString(),
      'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
    });

    if (record.count > options.max) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
        method: req.method,
      });

      res.status(429).json({
        error: options.message || 'Muitas requisições. Tente novamente mais tarde.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
};

// Pre-configured rate limiters
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições da API. Tente novamente em 15 minutos.',
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
});

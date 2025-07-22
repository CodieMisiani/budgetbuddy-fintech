import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again later', 429));
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per hour
  message: 'Too many requests from this IP, please try again after an hour',
  handler: (req, res, next) => {
    next(new AppError('Too many requests, please try again later', 429));
  }
});

export { authLimiter, apiLimiter };
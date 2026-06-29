import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    // Check for authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    // Attach decoded user payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Not authorized, invalid token' });
  }
};

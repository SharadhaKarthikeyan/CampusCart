import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err.message || err);

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum size allowed is 5MB' });
    }
    return res.status(400).json({ error: `Image upload failed: ${err.message}` });
  }

  // Handle errors thrown from our file filter
  if (err.message && err.message.includes('Only images are allowed')) {
    return res.status(400).json({ error: err.message });
  }

  // Handle custom validation or generic errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred on the server',
  });
};

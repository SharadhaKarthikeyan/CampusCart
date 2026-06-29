import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import authRoutes from './routes/authRoutes';
import listingsRoutes from './routes/listingsRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Body parser
app.use(express.json());

// Serve uploaded listing images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/users', userRoutes);

// Root route check
app.get('/', (req, res) => {
  res.json({ message: 'CampusCart API is running' });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

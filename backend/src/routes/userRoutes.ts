import { Router } from 'express';
import { getMyListings } from '../controllers/listingsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/me/listings', protect, getMyListings);

export default router;

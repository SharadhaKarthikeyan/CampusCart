import { Router } from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  markAsSold,
} from '../controllers/listingsController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);

// Protected routes
router.post('/', protect, upload.single('image'), createListing);
router.put('/:id', protect, upload.single('image'), updateListing);
router.delete('/:id', protect, deleteListing);
router.patch('/:id/sold', protect, markAsSold);

export default router;

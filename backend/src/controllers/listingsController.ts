import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../types';

const ALLOWED_CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Clothing', 'Home', 'Other'];
const ALLOWED_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const ALLOWED_STATUSES = ['Available', 'Sold'];

// GET /api/listings
export const getListings = async (req: AuthRequest, res: Response) => {
  try {
    const { search, category, condition, status, maxPrice } = req.query;

    const where: any = {};

    // Dynamic filtering setup
    const andFilters: any[] = [];

    if (search && typeof search === 'string') {
      andFilters.push({
        OR: [
          { title: { contains: search } },
          { description: { contains: search } }
        ]
      });
    }

    if (category && typeof category === 'string' && ALLOWED_CATEGORIES.includes(category)) {
      andFilters.push({ category });
    }

    if (condition && typeof condition === 'string' && ALLOWED_CONDITIONS.includes(condition)) {
      andFilters.push({ condition });
    }

    if (status && typeof status === 'string' && ALLOWED_STATUSES.includes(status)) {
      andFilters.push({ status });
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      andFilters.push({ price: { lte: Number(maxPrice) } });
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(listings);
  } catch (error: any) {
    console.error('getListings error:', error);
    return res.status(500).json({ error: 'Server error retrieving listings' });
  }
};

// GET /api/listings/:id
export const getListingById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    return res.json(listing);
  } catch (error: any) {
    console.error('getListingById error:', error);
    return res.status(500).json({ error: 'Server error retrieving listing details' });
  }
};

// POST /api/listings
export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { title, description, price, category, condition, location } = req.body;
    const priceNum = Number(price);

    // Validations
    if (!title || !description || isNaN(priceNum) || !category || !condition || !location) {
      return res.status(400).json({ error: 'Required fields missing or invalid' });
    }

    if (priceNum < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Allowed values: ${ALLOWED_CATEGORIES.join(', ')}` });
    }

    if (!ALLOWED_CONDITIONS.includes(condition)) {
      return res.status(400).json({ error: `Invalid condition. Allowed values: ${ALLOWED_CONDITIONS.join(', ')}` });
    }

    // Process image URL if uploaded
    let imageUrl: string | null = null;
    if (req.file) {
      // Store relative url path. The client will prepend backend base url if needed
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId: req.user.id,
        title,
        description,
        price: priceNum,
        category,
        condition,
        location,
        imageUrl,
        status: 'Available',
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json(listing);
  } catch (error: any) {
    console.error('createListing error:', error);
    return res.status(500).json({ error: 'Server error creating listing' });
  }
};

// PUT /api/listings/:id
export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    // Find existing listing
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this listing' });
    }

    const { title, description, price, category, condition, location, status } = req.body;
    const priceNum = price !== undefined ? Number(price) : undefined;

    // Build update data object
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    
    if (priceNum !== undefined) {
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Price must be a valid positive number' });
      }
      updateData.price = priceNum;
    }

    if (category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      updateData.category = category;
    }

    if (condition !== undefined) {
      if (!ALLOWED_CONDITIONS.includes(condition)) {
        return res.status(400).json({ error: 'Invalid condition' });
      }
      updateData.condition = condition;
    }

    if (location !== undefined) updateData.location = location;

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }

    // Handle new image update
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json(updatedListing);
  } catch (error: any) {
    console.error('updateListing error:', error);
    return res.status(500).json({ error: 'Server error updating listing' });
  }
};

// DELETE /api/listings/:id
export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await prisma.listing.delete({
      where: { id },
    });

    return res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('deleteListing error:', error);
    return res.status(500).json({ error: 'Server error deleting listing' });
  }
};

// PATCH /api/listings/:id/sold
export const markAsSold = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this listing' });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status: 'Sold' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json(updatedListing);
  } catch (error: any) {
    console.error('markAsSold error:', error);
    return res.status(500).json({ error: 'Server error marking listing as sold' });
  }
};

// GET /api/users/me/listings
export const getMyListings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const listings = await prisma.listing.findMany({
      where: { sellerId: req.user.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(listings);
  } catch (error: any) {
    console.error('getMyListings error:', error);
    return res.status(500).json({ error: 'Server error retrieving your listings' });
  }
};

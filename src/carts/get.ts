// src/carts/get.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../utils/firebase';

// Define the async handler
const getCartAsync = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  // Validate userId
  if (!userId) {
    res
      .status(401)
      .json({ error: 'User ID not verified. Authentication required.' });
    return;
  }

  try {
    const cartDoc = await db.collection('carts').doc(userId).get();
    if (!cartDoc.exists) {
      res.status(200).json({ cart: [] }); // Return empty cart if none exists
      return;
    }

    const cartData = cartDoc.data();
    res.status(200).json({ cart: cartData?.items || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Wrap the async handler to match Express's expected signature
export const getCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  getCartAsync(req, res).catch((error) => next(error));
};

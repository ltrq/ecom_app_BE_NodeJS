// src/carts/sync.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../utils/firebase';

// Define the expected request body structure
interface CartUpdateRequest {
  cart: any[]; // You can refine this to match CartItem if needed
  userId: string;
  email: string;
  timestamp: Date;
}

// Define the async handler
const syncCartAsync = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const cartData = req.body.cart;
  const email = req.body.email;

  // Validate required fields
  if (!userId) {
    res
      .status(401)
      .json({ error: 'User ID not verified. Authentication required.' });
    return;
  }
  if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
    res.status(400).json({ error: 'Cart data must be a non-empty array' });
    return;
  }
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required and must be a string' });
    return;
  }

  try {
    await db.collection('carts').doc(userId).set(
      {
        items: cartData,
        updatedAt: new Date().toISOString(),
        email: email, // Store email in the document
      },
      { merge: true }
    );
    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
};

// Wrap the async handler to match Express's expected signature
export const syncCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  syncCartAsync(req, res).catch((error) => next(error));
};

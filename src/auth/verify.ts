import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/firebase';

// Define the async middleware logic
const verifyTokenAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.userId = decodedToken.uid; // Type-safe with express.d.ts
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Wrap the async middleware
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyTokenAsync(req, res, next).catch((error) => next(error));
};

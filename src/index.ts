// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { verifyToken } from './auth/verify';
import { syncCart } from './carts/sync';
import { getCart } from './carts/get'; // Import the new handler
import { auth } from './utils/firebase';

// Extend Express Request type to include userId
interface AuthRequest extends Request {
  userId?: string; // Added by verifyToken middleware
}

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/', (req: Request, res: Response) => {
  res.send('LTRQ E-commerce Backend is running!');
});

app.post('/api/auth/verify', verifyToken, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    uid: req.userId ?? 'undefined',
    message: 'Token verified successfully',
  });
});

app.post('/api/carts/sync', verifyToken, syncCart);

app.get('/api/carts/get', verifyToken, getCart); // New endpoint to fetch cart

app.get('/api/auth/generate-token', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const uid = `user_${Date.now()}_${email.replace(/[@.]/g, '_')}`;
    const customToken = await auth.createCustomToken(uid, { email });
    res.status(200).json({
      token: customToken,
      message: 'Custom token generated successfully',
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

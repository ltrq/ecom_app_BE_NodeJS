// src/types/express.d.ts
declare namespace Express {
  interface Request {
    userId?: string; // Optional property set by verifyToken
  }
}

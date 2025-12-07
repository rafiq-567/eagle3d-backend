
import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';  

export const authMiddleware = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies?.session;
  if (!sessionCookie) {
    return res.status(401).json({ message: 'Unauthorized: session missing' });
  }

  try {
    // Firebase verifies the cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    req.user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: decodedClaims.role,
    };

    next();
  } catch (error) {
    console.error("Session cookie verification failed:", error);
    return res.status(401).json({ message: "Unauthorized: invalid or expired session" });
  }
};

export const adminMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }
  next();
};

import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string | null;
  };
}

export const checkCurrentUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Access Authorization from req header
  const Authorization = req.header('authorization');

  if (!Authorization) {
    req.user = {
      userId: null,
    };
    return next();
  }

  try {
    // Get token
    const token = Authorization.replace('Bearer ', '');

    // Verify
    const payload = jwt.verify(token, process.env.APP_SECRET || 'DEFAULT_SECRET') as JwtPayload;
    const { userId } = payload;

    // Assign req
    req.user = { userId };
    next();
  } catch (error) {
    // handle JWT verification error
    next();
  }
};

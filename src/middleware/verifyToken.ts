import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Access Authorization from req header
  const Authorization = req.header('authorization');

  if (!Authorization) {
    const error = new HttpError('Unauthorized!!', 400);
    return next(error);
  }

  // Get token
  const token = Authorization.replace('Bearer ', '');

  // Verify
  const payload = jwt.verify(token, process.env.APP_SECRET || 'DEFAULT_SECRET') as JwtPayload;
  const { userId, role } = payload;

  // Assign req
  req.user = { userId, role };
  next();
};

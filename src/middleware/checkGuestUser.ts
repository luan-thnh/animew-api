import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from './checkCurrentUser';

export interface GuestUserRequest extends Request {
  guestUserId?: string;
}

export const checkGuestUser = (
  req: GuestUserRequest & AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.user);
  if (req.user && req.user?.userId) {
    req.guestUserId = req.user?.userId;
    return next();
  }

  let guestUserId = req.cookies.guestUserId;

  if (!guestUserId) {
    // Tạo một guestUserId mới
    guestUserId = new Types.ObjectId().toHexString().toString();
  }

  // Lưu trữ guestUserId trong biến guestUserId của request
  req.guestUserId = guestUserId;

  // Nếu guestUserId chưa được lưu trong cookie, thì lưu nó vào cookie
  if (!req.cookies.guestUserId) {
    res.cookie('guestUserId', guestUserId);
  }

  next();
};

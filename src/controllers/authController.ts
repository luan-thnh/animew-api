import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from 'models/userModel';
import HistoryModel from 'models/historyModel';
import { HttpError } from 'middleware/errorHandler';
import { AuthenticatedRequest } from 'middleware/verifyToken';
import { AuthenticatedRequest as AuthenticatedRequestCurrent } from 'middleware/checkCurrentUser';
import { GuestUserRequest } from 'middleware/checkGuestUser';
import ProfileModel, { IProfile } from 'models/profileModel';

export const getCurrentUser = async (
  req: AuthenticatedRequestCurrent,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: {
      user: { username: string } | null;
    } = { user: null };

    if (req.user && req.user?.userId) {
      const user = await UserModel.findOne({ _id: req.user.userId })
        .populate('profile', 'avatar')
        .select('username');

      if (user) {
        data.user = user;
      }
    }

    res.status(200).json({
      statusText: 'Successful!',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const users = await UserModel.find({});

    res.status(200).json({
      statusText: 'Success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    const token = '';

    if (!deletedUser) {
      const error = new HttpError('User not found!', 400);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: `Account (${deletedUser.username.toLocaleUpperCase()}) has been deleted`,
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, role = 'public' } = req.body;

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const error = new HttpError('User with this email or username already exists!', 400);
      return next(error);
    }

    const user = await UserModel.create({ username, email, password, role });

    const newProfile: IProfile = {
      author: user._id,
      avatar: '',
      fullName: '',
      age: 0,
      address: '',
      description: '',
      level: 0,
    };

    const createdProfile = await ProfileModel.create(newProfile);

    user.profile = createdProfile._id;
    await user.save();

    const secret = process.env.APP_SECRET || 'DEFAULT_SECRET';
    const token = jwt.sign({ userId: user._id, role }, secret);

    res.status(200).json({
      statusText: 'Successful!',
      data: { token, username: user.username },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: GuestUserRequest, res: Response, next: NextFunction) => {
  try {
    const guestUserId = req.guestUserId;
    const { username, email, password } = req.body;

    const user = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      const error = new HttpError(
        'The account does not exist. Please check your login credentials and try again!',
        400,
      );
      return next(error);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      const error = new HttpError('Invalid password!', 400);
      return next(error);
    }

    const secret = process.env.APP_SECRET || 'DEFAULT_SECRET';
    const token = jwt.sign({ userId: user._id, role: user.role }, secret);

    const responseData: {
      statusText: string;
      message: string;
      data: {
        token: string;
        username: string;
      };
      redirectUrl?: string;
    } = {
      statusText: 'Successful!',
      message: 'Login successful! Welcome back to your account.',
      data: { token, username: user.username },
    };

    if (user?.role === 'admin') {
      responseData.redirectUrl = '/api/v1/admin';
    }

    if (guestUserId) {
      await HistoryModel.findOneAndUpdate({ userId: guestUserId }, { userId: user._id });

      res.clearCookie('guestUserId');
    }

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

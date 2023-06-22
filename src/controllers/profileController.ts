import { Request, Response, NextFunction } from 'express';
import ProfileModel, { IProfile } from '../models/profileModel';
import { AuthenticatedRequest } from 'middleware/checkCurrentUser';
import { HttpError } from 'middleware/errorHandler';
import UserModel from 'models/userModel';

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const profile = await ProfileModel.findOne({ author: userId })
      .populate('author', 'email username')
      .select('-updatedAt');

    if (!profile) {
      const error = new HttpError('Profile not found!', 404);
      next(error);
    }

    res.status(200).json({
      statusText: 'Successful',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new Error('User ID not found');
      next(error);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new HttpError('User not found!', 404);
      return next(error);
    }

    const { fullName, avatar = '', age, address, description, level } = req.body;

    const existingProfile = await ProfileModel.findOne({ author: userId });

    if (existingProfile) {
      const error = new HttpError('Profile already exists', 400);
      return next(error);
    }

    const newProfile: IProfile = {
      author: userId,
      fullName,
      avatar,
      age,
      address,
      description,
      level,
    };

    const createdProfile = await ProfileModel.create(newProfile);

    res.status(200).json({
      statusText: 'Successful',
      data: { profile: createdProfile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new Error('User ID not found');
      next(error);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new HttpError('User not found!', 404);
      return next(error);
    }

    const newProfile = await ProfileModel.findOneAndUpdate(
      { author: userId },
      { ...req.body },
      { new: true, runValidator: true },
    );

    res.status(200).json({
      statusText: 'Successful',
      data: { profile: newProfile },
    });
  } catch (error) {
    next(error);
  }
};

// Hàm updateAvatar
export const updateAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    console.log(userId);

    if (!userId) {
      const error = new HttpError('User ID not found', 404);
      next(error);
    }

    const { avatar } = req.body;

    console.log(req.body);

    if (!avatar) {
      const error = new HttpError('No avatar URL provided', 400);
      return next(error);
    }

    const newProfile = await ProfileModel.findOneAndUpdate(
      { author: userId },
      { avatar },
      { new: true },
    );

    console.log(newProfile);

    res.status(200).json({
      statusText: 'Successful',
      data: { profile: newProfile },
    });
  } catch (error) {
    next(error);
  }
};

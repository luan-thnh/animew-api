import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/checkCurrentUser';
import { HttpError } from '../middleware/errorHandler';
import UserModel from '../models/userModel';
import WatchListModel, { IWatchList } from '../models/watchListModel';

export const getAnimeWatchList = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new HttpError('User not found!', 404);
      return next(error);
    }

    const animeWatchList = await WatchListModel.find({ userId }).populate(
      'animeId',
      'title imageUrl episodeCount',
    );

    // const animeWatchListGround = animeWatchList.map(({ animeId }: IWatchList) => ({
    //   animeId,
    // }));

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        username: user.username,
        animeWatchList: animeWatchList,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addAnimeToWatchList = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { animeId } = req.params;

    const existingAnime = await WatchListModel.findOne({ animeId });

    if (existingAnime) {
      const error = new HttpError('Anime watch list already exists!', 400);
      return next(error);
    }

    const animeWatchList = await WatchListModel.create({ userId, animeId });

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        animeWatchList,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeAnimeFromWatchList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { animeWatchListId } = req.params;

    const deletedAnimeWatchList = await WatchListModel.findByIdAndDelete(animeWatchListId);

    if (!deletedAnimeWatchList) {
      const error = new HttpError('Anime watch list not found!', 404);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: `Anime watch list has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

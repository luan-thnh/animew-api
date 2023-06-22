import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'middleware/errorHandler';
import { AuthenticatedRequest } from './../middleware/checkCurrentUser';
import HistoryModel, { IHistory } from 'models/historyModel';
import UserModel from 'models/userModel';
import AnimeModel from 'models/animeModel';
import { IEpisode } from 'models/episodeModel';
import { GuestUserRequest } from 'middleware/checkGuestUser';
import mongoose, { ObjectId, Types } from 'mongoose';

export const getAnimeHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    console.log(userId);

    if (!userId) {
      throw new Error('User ID not found');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new HttpError('User not found!', 404);
      return next(error);
    }

    console.log(await HistoryModel.find({ userId }));

    const animeHistory = await HistoryModel.find({ userId })
      .populate('animeId', 'title imageUrl')
      .populate('episodes', 'episodeNumber')
      .select('watchedMinutes createdAt');

    // const animeHistoryGround = animeHistory.map(
    //   ({ _id, animeId, episodeId, watchedMinutes, createdAt }) => ({
    //     // animeId: animeId?._id,
    //     // episodeId,
    //     id: _id,
    //     title: animeId.title,
    //     imageUrl: animeId.imageUrl,
    //     episodeNumber: episodeId.episodeNumber,
    //     watchedMinutes,
    //     createdAt,
    //   }),
    // );

    res.status(200).json({
      data: {
        username: user.username,
        animeHistory: animeHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addAnimeToHistory = async (
  req: GuestUserRequest & AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let userId = req.guestUserId;

    if (req.user?.userId) {
      userId = req.user?.userId;
    }

    console.log(userId);

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { animeId } = req.params;
    const { ep } = req.query;

    const anime = await AnimeModel.findById(animeId).populate('episodes');
    const episode = anime?.episodes.find((episode) => episode.episodeNumber.toString() === ep);

    if (!anime) {
      const error = new HttpError('Invalid anime!', 400);
      return next(error);
    }

    if (!episode) {
      const error = new HttpError('Invalid episode for the specified anime!', 400);
      return next(error);
    }

    const existingAnime = await HistoryModel.findOne({ animeId });

    if (existingAnime) {
      await HistoryModel.updateOne(
        { _id: existingAnime._id },
        { $addToSet: { episodes: episode } },
      );
    } else {
      await HistoryModel.create({ userId, animeId, episodes: [episode] });
    }
  } catch (error) {
    next(error);
  }
};

export const removeAnimeFromHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { animeHistoryId } = req.params;

    const deletedAnimeHistory = await HistoryModel.findByIdAndDelete(animeHistoryId);

    if (!deletedAnimeHistory) {
      const error = new HttpError('Anime history not found!', 404);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: 'Anime history has been deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const updateWatchedMinutes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { animeHistoryId, watchedMinutes } = req.body;

    const updatedHistory = await HistoryModel.findByIdAndUpdate(
      animeHistoryId,
      { watchedMinutes },
      { new: true },
    );

    if (!updatedHistory) {
      const error = new HttpError('Anime history not found!', 404);
      return next(error);
    }

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        updatedHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

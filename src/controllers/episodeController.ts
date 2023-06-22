import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/verifyToken';
import { GuestUserRequest } from '../middleware/checkGuestUser';
import { addAnimeToHistory } from './historyController';
import AnimeModel from '../models/animeModel';
import EpisodeModel, { IEpisode } from '../models/episodeModel';

export const getEpisodes = async (req: GuestUserRequest, res: Response, next: NextFunction) => {
  try {
    const { animeId } = req.params;
    const { ep } = req.query;

    const anime = await AnimeModel.findById(animeId).populate('episodes');

    if (!anime) {
      const error = new HttpError('Anime not found!', 404);
      return next(error);
    }

    let episodes = anime.episodes;

    if (ep) {
      episodes = episodes.filter((episode) => episode.episodeNumber === parseInt(ep as string));
      await addAnimeToHistory(req, res, next);
    }

    res.status(200).json({
      statusText: 'Successful!',
      data: {
        animeId,
        title: anime.title,
        episodeCount: anime.episodeCount,
        episodes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const getAnimeByEpisode = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { episodeId } = req.params;

//     const episode = await EpisodeModel.findById(episodeId);

//     if (!episode) {
//       const error = new HttpError('Episode not found!', 400);
//       return next(error);
//     }

//     res.status(200).json({
//       statusText:  'Successful!',
//       data: {
//         episode,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const createEpisode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const { animeId } = req.params;
    const { title, videoUrl, episodeNumber } = req.body;

    const anime = await AnimeModel.findById(animeId);

    if (!anime) {
      const error = new HttpError('Anime not found!', 404);
      return next(error);
    }

    const episode: IEpisode = {
      title: `${anime.title} || ${title}`,
      videoUrl,
      episodeNumber,
    };

    const createdEpisode = await EpisodeModel.create(episode);

    anime.episodes.push(createdEpisode);
    await anime.save();

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        episode,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEpisode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const { episodeId } = req.params;

    const episode = await EpisodeModel.findByIdAndUpdate(
      episodeId,
      { ...req.body },
      { new: true, runValidator: true },
    );

    res.status(200).json({
      statusText: 'Successful!',
      data: { episode },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEpisode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const { episodeId } = req.params;

    const episode = await EpisodeModel.findByIdAndDelete(episodeId);

    if (!episode) {
      const error = new HttpError('Episode not found!', 400);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: `Episode has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

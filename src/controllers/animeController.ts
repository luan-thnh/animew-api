import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { HttpError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/verifyToken';
import AnimeModel, { IAnime } from '../models/animeModel';

export const getAnimes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skipItems = (page - 1) * limit;

    const totalAnimes = await AnimeModel.countDocuments();
    const totalPages = Math.ceil(totalAnimes / limit);

    const animes = await AnimeModel.find().skip(skipItems).limit(limit);

    res.status(200).json({
      statusText: 'Successful!',
      data: {
        pagination: {
          page,
          limit,
          totalPages,
          totalAnimes,
        },
        animes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnimeDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { animeId } = req.params;

    const anime = await AnimeModel.findById(animeId);

    if (!anime) {
      const error = new HttpError('Anime not exits!', 404);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      data: { anime },
    });
  } catch (error) {
    next(error);
  }
};

export const searchAnimes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, type, genre, year, gte, episodeCount, rating } = req.query as {
      title?: string;
      type?: string;
      genre?: string;
      year?: number;
      gte?: boolean;
      episodeCount?: number;
      rating?: number;
    };

    const searchFilters: FilterQuery<IAnime> = {};

    if (title) {
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      searchFilters.title = { $regex: new RegExp(`${escapedTitle}`, 'i') };
    }

    if (type) searchFilters.type = { $regex: type, $options: 'i' };

    if (genre)
      searchFilters.genres = { $all: genre.split(' ').map((g) => new RegExp(`^${g}$`, 'i')) };

    if (year) {
      searchFilters.releaseDate = {
        $gte: `${year}-01-01`,
        $lt: `${year + 1}-01-01`,
      };

      if (gte) {
        searchFilters.releaseDate = { $gte: `${year}-01-01` };
      }
    }

    if (episodeCount) {
      searchFilters.episodeCount = episodeCount;

      if (gte) {
        searchFilters.episodeCount = { $gte: episodeCount };
      }
    }

    if (rating) searchFilters.rating = { $gte: rating };

    const animes = await AnimeModel.find(searchFilters);

    res.status(200).json({
      statusText: 'Successful!',
      data: { animes },
    });
  } catch (error) {
    next(error);
  }
};

export const popularAnimes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skipItems = (page - 1) * limit;

    const query = { rating: { $gte: 8 } };

    const totalAnimes = await AnimeModel.countDocuments(query);
    const totalPages = Math.ceil(totalAnimes / limit);

    const animes = await AnimeModel.find(query).skip(skipItems).limit(limit);

    res.status(200).json({
      statusText: 'Successful!',
      data: {
        pagination: {
          page,
          limit,
          totalPages,
          totalAnimes,
        },
        animes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const topAnime = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yearCurrent = new Date().getFullYear();
    const monthCurrent = new Date().getMonth() + 1;

    const monthPrevious = monthCurrent === 1 ? 12 : monthCurrent - 1;
    const daysInPreviousMonth = new Date(yearCurrent, monthPrevious, 0).getDate();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skipItems = (page - 1) * limit;

    const query = {
      rating: { $gte: 9 },
      releaseDate: {
        $gte: `${yearCurrent}-${(monthPrevious - 1).toString().padStart(2, '0')}-01`,
        $lte: `${yearCurrent}-${monthPrevious.toString().padStart(2, '0')}-${daysInPreviousMonth
          .toString()
          .padStart(2, '0')}`,
      },
    };

    const totalAnimes = await AnimeModel.countDocuments(query);
    const totalPages = Math.ceil(totalAnimes / limit);

    const animes = await AnimeModel.find(query).skip(skipItems).limit(limit);

    res.status(200).json({
      statusText: 'Successful!',
      data: {
        pagination: {
          page,
          limit,
          totalPages,
          totalAnimes,
        },
        animes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAnime = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const {
      title,
      type,
      imageUrl,
      description,
      releaseDate,
      episodeCount,
      rating,
      genres,
      episodes,
    } = req.body;

    const anime: IAnime = {
      title,
      type,
      imageUrl,
      description,
      releaseDate,
      episodeCount,
      rating,
      genres,
      episodes,
    };

    const existingAnime = await AnimeModel.findOne({ title });
    if (existingAnime) {
      const error = new HttpError('Anime with this already exists!', 400);
      return next(error);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
      const error = new HttpError(
        `Invalid date format: ${releaseDate}. Expected format: YYYY-MM-DD`,
        400,
      );
      return next(error);
    }

    const createdAnime = await AnimeModel.create(anime);

    res.status(200).json({
      statusText: 'Successful!',
      data: { createdAnime },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnime = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const { animeId } = req.params;

    const anime = await AnimeModel.findByIdAndUpdate(
      animeId,
      { ...req.body },
      { new: true, runValidator: true },
    ); // new: true khi mà chúng ta update thì thay vì nó phản hồi bài post cũ thì nó sẽ phản hồi post đã update

    res.status(200).json({
      statusText: 'Successful!',
      data: { anime },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnime = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new HttpError('You are not authorized to perform this action!', 400);
      return next(error);
    }

    const { animeId } = req.params;

    const anime = await AnimeModel.findByIdAndDelete(animeId);

    if (!anime) {
      const error = new HttpError('Anime not found!', 400);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: `Anime (${anime.title.toLocaleUpperCase()}) has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

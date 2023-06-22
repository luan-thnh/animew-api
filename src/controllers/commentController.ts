import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/checkCurrentUser';
import { HttpError } from '../middleware/errorHandler';
import CommentModel from '../models/commentModel';

export const getCommentsByAnimeId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { animeId } = req.params;

    const comments = await CommentModel.find({ anime: animeId })
      .populate({
        path: 'author',
        select: 'username',
        populate: { path: 'profile', select: 'avatar level' },
      })
      .populate('anime', 'title')
      .sort({ createdAt: 'desc' });

    if (!comments) {
      const error = new HttpError('Comments not exits!', 404);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new HttpError('User ID not found', 404);
      return next(error);
    }

    const { animeId, content } = req.body;

    const newComment = await CommentModel.create({
      author: userId,
      anime: animeId,
      content,
    });

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        newComment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new HttpError('User ID not found', 404);
      return next(error);
    }

    const { commentId } = req.params;

    const newComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { author: userId, ...req.body },
      { new: true },
    );

    if (!newComment) {
      const error = new HttpError('Comment not found', 404);
      return next(error);
    }

    res.status(201).json({
      statusText: 'Successful!',
      data: {
        newComment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const comment = await CommentModel.findByIdAndDelete(commentId);

    if (!comment) {
      const error = new HttpError('Comment not found', 404);
      return next(error);
    }

    res.status(200).json({
      statusText: 'Successful!',
      message: `Comment has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

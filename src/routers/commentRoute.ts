import { Router } from 'express';
import { checkCurrentUser } from '../middleware/checkCurrentUser';
import {
  createComment,
  deleteComment,
  getCommentsByAnimeId,
  updateComment,
} from '../controllers/commentController';

const router = Router();

router.post('/', checkCurrentUser, createComment);
router.get('/anime/:animeId', checkCurrentUser, getCommentsByAnimeId);
router.put('/:commentId', checkCurrentUser, updateComment);
router.delete('/:commentId', deleteComment);

export default router;

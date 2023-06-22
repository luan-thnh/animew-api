import { Router } from 'express';
import { checkCurrentUser } from 'middleware/checkCurrentUser';
import {
  createProfile,
  getProfile,
  updateAvatar,
  updateProfile,
} from 'controllers/profileController';
import multer from 'multer';

const router = Router();

router.post('/create', checkCurrentUser, createProfile);
router.get('/', checkCurrentUser, getProfile);
router.post('/avatar', checkCurrentUser, updateAvatar);
router.put('/update', checkCurrentUser, updateProfile);

export default router;

import { Router } from 'express';
import { getCurrentUser, deleteUser, register, login } from '../controllers/authController';
import { checkCurrentUser } from '../middleware/checkCurrentUser';
import { verifyToken } from '../middleware/verifyToken';
import { checkGuestUser } from '../middleware/checkGuestUser';

const router = Router();

router.get('/', verifyToken, checkCurrentUser, getCurrentUser);
router.post('/register', register);
router.post('/login', checkGuestUser, login);
router.delete('/delete/:userId', checkCurrentUser, deleteUser);

export default router;

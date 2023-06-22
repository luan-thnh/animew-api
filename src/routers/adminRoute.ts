import { Router } from 'express';
import { verifyToken } from 'middleware/verifyToken';
import { createAnime, updateAnime, deleteAnime } from 'controllers/animeController';
import { createEpisode, deleteEpisode, updateEpisode } from 'controllers/episodeController';
import { getAllUser } from 'controllers/authController';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json('🤪Welcome to AnimeW API Admin!');
});

// Users
router.get('/auth/users', verifyToken, getAllUser);

// Anime
router.post('/anime', verifyToken, createAnime);
router.route('/anime/:animeId').put(verifyToken, updateAnime).delete(verifyToken, deleteAnime);

// Episodes
router.post('/anime/:animeId/episodes', verifyToken, createEpisode);
router
  .route('/anime/:animeId/episodes/:episodeId')
  .put(verifyToken, updateEpisode)
  .delete(verifyToken, deleteEpisode);

export default router;

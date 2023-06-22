import { Router } from 'express';
import {
  getAnimes,
  getAnimeDetails,
  searchAnimes,
  popularAnimes,
  topAnime,
} from '../controllers/animeController';
import { getEpisodes } from '../controllers/episodeController';
import {
  addAnimeToHistory,
  getAnimeHistory,
  removeAnimeFromHistory,
  updateWatchedMinutes,
} from '../controllers/historyController';
import {
  getAnimeWatchList,
  addAnimeToWatchList,
  removeAnimeFromWatchList,
} from '../controllers/watchListController';
import { checkCurrentUser } from '../middleware/checkCurrentUser';
import { checkGuestUser } from '../middleware/checkGuestUser';

const router = Router();

// User
router.get('/', (req, res) => {
  res.status(200).json('🤪Welcome to AnimeW API!');
});

router.get('/anime-list', getAnimes);
router.get('/search', searchAnimes);
router.get('/popular', popularAnimes);
router.get('/top-anime', topAnime);

router.get('/details/:animeId/', getAnimeDetails);
router.get('/details/:animeId/episodes', checkGuestUser, checkCurrentUser, getEpisodes);

router.get('/history', checkCurrentUser, getAnimeHistory);
// router.post('/history/:animeId', checkCurrentUser, addAnimeToHistory);
router.route('/history/:animeHistoryId').delete(removeAnimeFromHistory).put(updateWatchedMinutes);

router.get('/watch-list', checkCurrentUser, getAnimeWatchList);
router.post('/watch-list/:animeId', checkCurrentUser, addAnimeToWatchList);
router.delete('/watch-list/:animeWatchListId', removeAnimeFromWatchList);

export default router;

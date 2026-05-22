import { Router } from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmark.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getBookmarks);
router.post('/:eventId', protect, toggleBookmark);

export default router;

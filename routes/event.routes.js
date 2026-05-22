import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  updateEvent
} from '../controllers/event.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listEvents);
router.get('/:eventId', getEventById);
router.post('/', protect, createEvent);
router.put('/:eventId', protect, updateEvent);
router.delete('/:eventId', protect, deleteEvent);

export default router;

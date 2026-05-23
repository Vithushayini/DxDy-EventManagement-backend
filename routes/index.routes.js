import express from 'express';
const router = express.Router();


import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import eventRoutes from './event.routes.js';
import bookmarkRoutes from './bookmark.routes.js';


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;


import { getBookmarks as getBookmarksService, toggleBookmark as toggleBookmarkService } from '../services/bookmark.service.js';

export async function getBookmarks(req, res) {
  try {
    const savedEvents = await getBookmarksService(req.user._id);
    res.json({ items: savedEvents });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to load bookmarks' });
  }
}

export async function toggleBookmark(req, res) {
  try {
    const result = await toggleBookmarkService(req.user._id, req.params.eventId);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update bookmark' });
  }
}

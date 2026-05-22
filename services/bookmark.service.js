import User from '../models/User.model.js';
import Event from '../models/Event.model.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function getBookmarks(userId) {
  const user = await User.findById(userId).populate('savedEvents');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user.savedEvents;
}

export async function toggleBookmark(userId, eventId) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createHttpError(404, 'Event not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const savedEventIds = user.savedEvents.map((id) => id.toString());
  const exists = savedEventIds.includes(event._id.toString());

  if (exists) {
    user.savedEvents = user.savedEvents.filter((id) => id.toString() !== event._id.toString());
  } else {
    user.savedEvents.push(event._id);
  }

  await user.save();
  await user.populate('savedEvents');

  return {
    bookmarked: !exists,
    savedEvents: user.savedEvents
  };
}
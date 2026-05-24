import Event from '../models/Event.model.js';
import { enrichLocation } from './location.service.js';
import { slugify } from '../utils/slug.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function buildFilters(query) {
  const filters = {};

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { category: { $regex: query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(query.search, 'i')] } },
      { 'location.city': { $regex: query.search, $options: 'i' } }
    ];
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.city) {
    filters['location.city'] = { $regex: query.city, $options: 'i' };
  }

  if (query.country) {
    filters['location.country'] = { $regex: query.country, $options: 'i' };
  }

  if (query.createdBy) {
    filters.createdBy = query.createdBy;
  }

  return filters;
}

export async function listEvents(query) {
  const { limit = 20, page = 1 } = query;
  const filters = buildFilters(query);

  const [events, total] = await Promise.all([
    Event.find(filters)
      .sort({ startDate: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    Event.countDocuments(filters)
  ]);

  return {
    status: 'success',
    items: events,
    page: Number(page),
    limit: Number(limit),
    total
  };
}

export async function getEventById(eventId) {
  return Event.findById(eventId).populate('createdBy', 'name email');
}

export async function createEvent(payload, userId) {
  const { location, title } = payload;
  const enrichedLocation = await enrichLocation(location);

  return Event.create({
    ...payload,
    slug: slugify(title),
    location: enrichedLocation || location,
    isCustom: true,
    createdBy: userId
  });
}

export async function updateEvent(eventId, payload, userId) {
  const event = await Event.findById(eventId);

  if (!event) {
    throw createHttpError(404, 'Event not found');
  }

  if (!event.isCustom || event.createdBy?.toString() !== userId.toString()) {
    throw createHttpError(403, 'You can only edit your own custom events');
  }

  const nextLocation = payload.location ? await enrichLocation(payload.location) : event.location;

  Object.assign(event, {
    ...payload,
    slug: payload.title ? slugify(payload.title) : event.slug,
    location: nextLocation || payload.location || event.location
  });

  await event.save();
  return event;
}

export async function deleteEvent(eventId, userId) {
  const event = await Event.findById(eventId);

  if (!event) {
    throw createHttpError(404, 'Event not found');
  }

  if (!event.isCustom || event.createdBy?.toString() !== userId.toString()) {
    throw createHttpError(403, 'You can only delete your own custom events');
  }

  await event.deleteOne();
}
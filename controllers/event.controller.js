import {
  createEvent as createEventService,
  deleteEvent as deleteEventService,
  getEventById as getEventByIdService,
  listEvents as listEventsService,
  updateEvent as updateEventService
} from '../services/event.service.js';

export async function listEvents(req, res) {
  try {
    const events = await listEventsService(req.query);
    res.json(events);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to load events' });
  }
}

export async function getEventById(req, res) {
  try {
    const event = await getEventByIdService(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to load event' });
  }
}

export async function createEvent(req, res) {
  try {
    const event = await createEventService(req.body, req.user._id);
    res.status(201).json(event);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create event' });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await updateEventService(req.params.eventId, req.body, req.user._id);
    res.json(event);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update event' });
  }
}

export async function deleteEvent(req, res) {
  try {
    await deleteEventService(req.params.eventId, req.user._id);
    res.status(204).send();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to delete event' });
  }
}

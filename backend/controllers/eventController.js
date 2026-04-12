const Event = require('../models/eventModel');

const getEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('registeredParticipants', 'name email');
  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);
  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

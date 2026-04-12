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

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;

  if (event) {
    if (event.registeredParticipants.includes(userId)) {
      res.status(400);
      throw new Error('Already registered for this event');
    }
    
    event.registeredParticipants.push(userId);
    await event.save();
    res.status(200).json({ message: 'Successfully registered' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const cancelRegistration = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const isRegistered = event.registeredParticipants.some(
    (participantId) => participantId.toString() === userId
  );

  if (!isRegistered) {
    res.status(400);
    throw new Error('You are not registered for this event');
  }

  event.registeredParticipants = event.registeredParticipants.filter(
    (participantId) => participantId.toString() !== userId
  );

  await event.save();
  res.status(200).json({ message: 'Registration cancelled successfully' });
};

const getRecommendedEvents = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // 1. Find user's interests (categories of events they are registered for)
    const userEvents = await Event.find({ registeredParticipants: userId });
    const interests = [...new Set(userEvents.map(e => e.category))];

    // 2. Base query: events user is NOT registered for
    const baseQuery = { registeredParticipants: { $ne: userId } };

    let recommended = [];

    // 3. If user has interests, find events in those categories
    if (interests.length > 0) {
      recommended = await Event.find({
        ...baseQuery,
        category: { $in: interests }
      }).limit(6);
    }

    // 4. Fill to 6 items with newest/general events if needed
    if (recommended.length < 6) {
      const moreEvents = await Event.find({
        ...baseQuery,
        _id: { $nin: recommended.map(e => e._id) }
      })
      .sort({ createdAt: -1 })
      .limit(6 - recommended.length);
      
      recommended = [...recommended, ...moreEvents];
    }

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getRecommendedEvents,
};

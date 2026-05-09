const Notification = require('../models/notificationModel');
const Event = require('../models/eventModel');

const createAdminNotification = async (payload) => {
  try {
    return await Notification.create({ ...payload, audience: 'admin' });
  } catch (error) {
    console.error('Admin notification could not be created:', error.message);
    return null;
  }
};

const createUserNotification = async (payload) => {
  try {
    return await Notification.create({ ...payload, audience: 'user' });
  } catch (error) {
    if (error?.code === 11000) return null;
    console.error('User notification could not be created:', error.message);
    return null;
  }
};

const createBulkUserNotifications = async (userIds, payloadFactory) => {
  const docs = userIds
    .map((userId) => {
      const payload = typeof payloadFactory === 'function' ? payloadFactory(userId) : payloadFactory;
      if (!payload) return null;
      return { ...payload, audience: 'user', recipientUser: userId };
    })
    .filter(Boolean);

  if (!docs.length) return 0;

  try {
    await Notification.insertMany(docs, { ordered: false });
    return docs.length;
  } catch (error) {
    if (error?.code !== 11000) {
      console.error('Bulk user notifications could not be created:', error.message);
    }
    return 0;
  }
};

const parseEventDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (!Number.isNaN(date.getTime())) return date;

  const cleaned = String(dateValue).split('T')[0].trim();
  const fallback = new Date(cleaned);
  if (!Number.isNaN(fallback.getTime())) return fallback;

  return null;
};

const toLocalMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const ensureUpcomingEventNotificationsForUser = async (userId) => {
  const events = await Event.find({ registeredParticipants: userId })
    .select('_id title date')
    .lean();

  if (!events.length) return;

  const today = toLocalMidnight(new Date());

  await Promise.all(events.map(async (event) => {
    const parsedDate = parseEventDate(event.date);
    if (!parsedDate) return;

    const eventDay = toLocalMidnight(parsedDate);
    const diffDays = Math.round((eventDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays !== 2) return;

    const dateKey = `${eventDay.getFullYear()}-${String(eventDay.getMonth() + 1).padStart(2, '0')}-${String(eventDay.getDate()).padStart(2, '0')}`;

    await createUserNotification({
      type: 'upcoming_event',
      recipientUser: userId,
      title: 'Upcoming event reminder',
      message: `${event.title} is happening in 2 days.`,
      eventTitle: event.title,
      event: event._id,
      dedupeKey: `upcoming-event:${event._id}:${dateKey}`,
    });
  }));
};

module.exports = {
  createAdminNotification,
  createUserNotification,
  createBulkUserNotifications,
  ensureUpcomingEventNotificationsForUser,
};

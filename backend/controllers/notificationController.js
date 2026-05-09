const Notification = require('../models/notificationModel');
const { ensureUpcomingEventNotificationsForUser } = require('../utils/notificationService');

const getAdminNotifications = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const notifications = await Notification.find({
    $or: [
      { audience: 'admin' },
      { audience: { $exists: false } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    isRead: false,
    $or: [
      { audience: 'admin' },
      { audience: { $exists: false } },
    ],
  });

  res.json({ notifications, unreadCount });
};

const getUserNotifications = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 40, 100);

  await ensureUpcomingEventNotificationsForUser(req.user._id);

  const query = { audience: 'user', recipientUser: req.user._id };
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  res.json({ notifications, unreadCount });
};

const markNotificationRead = async (req, res) => {
  const query = req.user?.isAdmin
    ? {
        _id: req.params.id,
        $or: [
          { audience: 'admin' },
          { audience: { $exists: false } },
        ],
      }
    : {
        _id: req.params.id,
        audience: 'user',
        recipientUser: req.user._id,
      };

  const notification = await Notification.findOne(query);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  const updated = await notification.save();
  res.json(updated);
};

const markAllAdminNotificationsRead = async (req, res) => {
  await Notification.updateMany(
    {
      isRead: false,
      $or: [
        { audience: 'admin' },
        { audience: { $exists: false } },
      ],
    },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
};

const markAllUserNotificationsRead = async (req, res) => {
  await Notification.updateMany(
    { isRead: false, audience: 'user', recipientUser: req.user._id },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
};

module.exports = {
  getAdminNotifications,
  getUserNotifications,
  markNotificationRead,
  markAllAdminNotificationsRead,
  markAllUserNotificationsRead,
};

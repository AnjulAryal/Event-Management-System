const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(limit);

  const unreadCount = await Notification.countDocuments({ isRead: false });

  res.json({ notifications, unreadCount });
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  const updated = await notification.save();
  res.json(updated);
};

const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};

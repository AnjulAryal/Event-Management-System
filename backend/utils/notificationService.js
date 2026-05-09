const Notification = require('../models/notificationModel');

const createAdminNotification = async (payload) => {
  try {
    return await Notification.create(payload);
  } catch (error) {
    console.error('Admin notification could not be created:', error.message);
    return null;
  }
};

module.exports = { createAdminNotification };

const express = require('express');
const router = express.Router();
const {
  getAdminNotifications,
  getUserNotifications,
  markNotificationRead,
  markAllAdminNotificationsRead,
  markAllUserNotificationsRead,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAdminNotifications);

router.route('/user')
  .get(protect, getUserNotifications);

router.route('/read-all')
  .put(protect, admin, markAllAdminNotificationsRead);

router.route('/user/read-all')
  .put(protect, markAllUserNotificationsRead);

router.route('/:id/read')
  .put(protect, markNotificationRead);

module.exports = router;

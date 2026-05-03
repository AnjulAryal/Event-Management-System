const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getRecommendedEvents,
  getEventsBySpeaker,
  initiatePayment,
  verifyPaymentAndRegister,
} = require('../controllers/eventController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

router.route('/recommendations')
  .get(protect, getRecommendedEvents);

router.route('/:id/register')
  .post(protect, registerForEvent);

router.route('/:id/initiate-payment')
  .post(protect, initiatePayment);

router.route('/verify-payment')
  .post(protect, verifyPaymentAndRegister);

router.route('/:id/cancel')
  .post(protect, cancelRegistration);

router.route('/by-speaker/:speakerId')
  .get(getEventsBySpeaker);

router.route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;

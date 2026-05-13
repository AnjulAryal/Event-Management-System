const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackAnalysis,
  submitFeedback,
  removeFeedback,
  replyToFeedback,
  getFeedbackByEvent,
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/analysis')
  .get(protect, admin, getFeedbackAnalysis);

router.route('/')
  .get(protect, admin, getAllFeedback)
  .post(submitFeedback);

router.route('/event/:title')
  .get(getFeedbackByEvent);

router.route('/:id')
  .delete(protect, admin, removeFeedback);

router.route('/:id/reply')
  .post(protect, admin, replyToFeedback);

module.exports = router;

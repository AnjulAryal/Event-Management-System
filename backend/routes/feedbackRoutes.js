const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  submitFeedback,
  removeFeedback,
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllFeedback)
  .post(submitFeedback);

router.route('/:id')
  .delete(protect, admin, removeFeedback);

module.exports = router;

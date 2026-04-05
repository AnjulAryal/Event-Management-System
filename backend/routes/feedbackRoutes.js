const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  submitFeedback,
  removeFeedback,
} = require('../controllers/feedbackController');

router.route('/')
  .get(getAllFeedback)
  .post(submitFeedback);

router.route('/:id')
  .delete(removeFeedback);

module.exports = router;

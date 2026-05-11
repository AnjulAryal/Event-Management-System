const express = require('express');
const router = express.Router();
const {
  getSpeakerTopics,
  createSpeakerTopic,
} = require('../controllers/speakerTopicController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSpeakerTopics)
  .post(protect, admin, createSpeakerTopic);

module.exports = router;

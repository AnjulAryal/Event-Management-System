const express = require('express');
const router = express.Router();
const {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} = require('../controllers/speakerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSpeakers)
  .post(protect, admin, createSpeaker);

router.route('/:id')
  .get(getSpeakerById)
  .put(protect, admin, updateSpeaker)
  .delete(protect, admin, deleteSpeaker);

module.exports = router;

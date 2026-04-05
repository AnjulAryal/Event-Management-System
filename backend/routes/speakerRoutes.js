const express = require('express');
const router = express.Router();
const {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} = require('../controllers/speakerController');

router.route('/')
  .get(getSpeakers)
  .post(createSpeaker);

router.route('/:id')
  .get(getSpeakerById)
  .put(updateSpeaker)
  .delete(deleteSpeaker);

module.exports = router;

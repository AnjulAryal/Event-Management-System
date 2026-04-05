const express = require('express');
const router = express.Router();
const {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
} = require('../controllers/supportController');

router.route('/')
  .get(getAllSupportRequests)
  .post(submitSupportRequest);

router.route('/:id')
  .put(updateSupportRequest);

module.exports = router;

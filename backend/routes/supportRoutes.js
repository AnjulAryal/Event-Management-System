const express = require('express');
const router = express.Router();
const {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
} = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllSupportRequests)
  .post(submitSupportRequest);

router.route('/:id')
  .put(protect, admin, updateSupportRequest);

module.exports = router;

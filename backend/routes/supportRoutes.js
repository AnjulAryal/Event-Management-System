const express = require('express');
const router = express.Router();
const {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
  replySupportRequest,
} = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllSupportRequests)
  .post(submitSupportRequest);

router.route('/:id/reply')
  .post(protect, admin, replySupportRequest);

router.route('/:id')
  .put(protect, admin, updateSupportRequest)
  .delete(protect, admin, deleteSupportRequest);

module.exports = router;

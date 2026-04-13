const express = require('express');
const router = express.Router();
const {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
} = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllSupportRequests)
  .post(submitSupportRequest);

router.route('/:id')
  .put(protect, admin, updateSupportRequest)
  .delete(protect, admin, deleteSupportRequest);

module.exports = router;

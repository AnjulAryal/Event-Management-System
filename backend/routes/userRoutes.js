const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.post('/verifycode', verifyResetCode);
router.put('/resetpassword', resetPassword);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  suspendUser,
  deleteUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getAllUsers).post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.post('/verifycode', verifyResetCode);
router.put('/resetpassword', resetPassword);
router.route('/:id/suspend').put(protect, admin, suspendUser);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;

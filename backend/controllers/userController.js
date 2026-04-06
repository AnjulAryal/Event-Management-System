const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Private/Admin (or Public for first admin)
const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const adminExists = await User.findOne({ isAdmin: true });

  if (isAdmin) {
    if (adminExists) {
      res.status(400);
      throw new Error('An admin already exists. Only one admin is allowed.');
    }
    // Allow creating the first admin
  } else {
    // Creating a regular user. This MUST be done by an existing admin.
    // We check for req.user which should be populated by protect middleware.
    if (!req.user || !req.user.isAdmin) {
      // Try to manually check token if protect middleware wasn't used in routes
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
          const requestingUser = await User.findById(decoded.id);
          if (!requestingUser || !requestingUser.isAdmin) {
            res.status(401);
            throw new Error('Not authorized to register users. Only admin can register users.');
          }
        } catch (error) {
          res.status(401);
          throw new Error('Not authorized, token failed');
        }
      } else {
        res.status(401);
        throw new Error('Not authorized. No token provided.');
      }
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: isAdmin || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Forgot password - send reset code
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with that email');
  }

  // Generate 6-digit random code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set code and expiration (10 minutes)
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <div style="background-color: #5CB85C; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">EVENTIFY</h1>
      </div>
      <div style="padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #444; margin-bottom: 20px;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please use the verification code below to proceed with the reset process:</p>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #5CB85C; letter-spacing: 5px;">${resetCode}</span>
        </div>
        <p>This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email from Eventify System. Please do not reply.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Verification Code - Eventify',
      message: `Your password reset verification code is: ${resetCode}`,
      html: emailHtml,
    });

    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Email send error:', error);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(500).json({ success: false, message: 'Email could not be sent. Please try again later.' });
  }
};

// @desc    Verify reset code
// @route   POST /api/users/verifycode
// @access  Public
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  res.status(200).json({ success: true, message: 'Code verified' });
};

// @desc    Reset password
// @route   PUT /api/users/resetpassword
// @access  Public
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update password
  user.password = password;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
};

module.exports = { 
  authUser, 
  registerUser, 
  getUserProfile, 
  forgotPassword, 
  verifyResetCode, 
  resetPassword 
};

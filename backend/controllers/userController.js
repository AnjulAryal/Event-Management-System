const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
   
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Private/Admin (or Public for first admin)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const plainPassword = password; // capture before hashing

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
  } else {
    // Regular users can be registered by non-admins or admins?
    // Based on user feedback (Conversation fd74241e), only admin can register users.
    
    let isAuthorized = false;
    if (req.user && req.user.isAdmin) {
      isAuthorized = true;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const currentUser = await User.findById(decoded.id).select('-password');
        if (currentUser && currentUser.isAdmin) {
          isAuthorized = true;
        }
      } catch (error) {
        console.error('Token verification error in registerUser:', error);
      }
    }

    if (!isAuthorized) {
      res.status(401);
      throw new Error('Not authorized to register users. Only admin can register users.');
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: isAdmin || false,
  });

  if (user) {
    // Send welcome email (non-blocking — failure won't stop registration)
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Eventify 🎉',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #5CB85C 0%, #3d8b3d 100%); padding: 40px 40px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Eventify</h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 500;">Your account is ready 🎊</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #1e293b; font-size: 22px; font-weight: 700;">Welcome aboard, ${user.name}!</h2>
              <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.7;">
                Your Eventify account has been created successfully. You can now explore upcoming events, register for sessions, and manage everything from your dashboard.
              </p>

              <!-- Info box -->
              <div style="background: #f0fdf4; border-left: 4px solid #5CB85C; border-radius: 0 10px 10px 0; padding: 18px 22px; margin-bottom: 28px;">
                <p style="margin: 0 0 10px; color: #166534; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Your Login Credentials</p>
                <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Name:</strong> ${user.name}</p>
                <p style="margin: 6px 0 0; color: #475569; font-size: 14px;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 6px 0 0; color: #475569; font-size: 14px;"><strong>Password:</strong> <span style="font-family: monospace; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-size: 13px;">${plainPassword}</span></p>
                <p style="margin: 10px 0 0; color: #94a3b8; font-size: 12px;">⚠️ Please keep your credentials safe and change your password after first login.</p>
              </div>

              <!-- CTA -->
              <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #5CB85C, #3d8b3d); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; letter-spacing: 0.3px;">
                Go to Dashboard →
              </a>

              <p style="margin: 28px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                If you didn't create this account, please ignore this email or contact our support team immediately.
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Eventify. All rights reserved.</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Welcome email failed (non-fatal):', emailErr.message);
    }

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
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password - send reset code
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with that email');
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

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

    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }
});

// @desc    Verify reset code
// @route   POST /api/users/verifycode
// @access  Public
const verifyResetCode = asyncHandler(async (req, res) => {
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
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = password;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    // We only want to allow password updates if a new password is provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Allow updating phone and profilePicture
    if (req.body.phone !== undefined) {
      user.phone = req.body.phone;
    }
    if (req.body.profilePicture !== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false }).select('-password -resetPasswordCode -resetPasswordExpires');
  res.json(users);
});

// @desc    Toggle suspend/unsuspend a user
// @route   PUT /api/users/:id/suspend
// @access  Private/Admin
const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.isSuspended = !user.isSuspended;
  await user.save();
  res.json({ message: user.isSuspended ? 'User suspended' : 'User unsuspended', isSuspended: user.isSuspended });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
});

module.exports = { 
  authUser, 
  registerUser, 
  getAllUsers,
  getUserProfile, 
  updateUserProfile,
  suspendUser,
  deleteUser,
  forgotPassword, 
  verifyResetCode, 
  resetPassword 
};

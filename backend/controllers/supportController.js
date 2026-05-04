const Support = require('../models/supportModel');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../middleware/asyncHandler');

const submitSupportRequest = asyncHandler(async (req, res) => {
  const support = new Support(req.body);
  const createdSupport = await support.save();
  res.status(201).json(createdSupport);
});

const getAllSupportRequests = asyncHandler(async (req, res) => {
  const supports = await Support.find({});
  res.json(supports);
});

const updateSupportRequest = asyncHandler(async (req, res) => {
  const support = await Support.findById(req.params.id);
  if (support) {
    support.status = req.body.status || support.status;
    const updatedSupport = await support.save();
    res.json(updatedSupport);
  } else {
    res.status(404);
    throw new Error('Support request not found');
  }
});

const deleteSupportRequest = asyncHandler(async (req, res) => {
  const support = await Support.findById(req.params.id);
  if (support) {
    await Support.findByIdAndDelete(req.params.id);
    res.json({ message: 'Support request removed' });
  } else {
    res.status(404);
    throw new Error('Support request not found');
  }
});

const replySupportRequest = asyncHandler(async (req, res) => {
  const { replyMessage } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    return res.status(400).json({ message: 'Reply message is required' });
  }

  const support = await Support.findById(req.params.id);
  if (!support) {
    return res.status(404).json({ message: 'Support request not found' });
  }

  try {
    await sendEmail({
      email: support.email,
      subject: 'Response to Your Support Request – Eventify',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 36px 40px 28px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Eventify Support</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">We've responded to your request</p>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px;">
            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your original message</p>
            <div style="background: #f8fafc; border-left: 3px solid #22c55e; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
              <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6; font-style: italic;">"${support.message}"</p>
            </div>

            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Admin Response</p>
            <div style="background: #f0fdf4; border-radius: 10px; padding: 20px 24px; margin-bottom: 32px;">
              <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.7;">${replyMessage.replace(/\n/g, '<br/>')}</p>
            </div>

            <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center;">
              This reply was sent by the Eventify admin team to <strong>${support.email}</strong>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Eventify. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // Mark ticket as resolved
    support.status = 'resolved';
    await support.save();

    res.json({ message: 'Reply sent successfully', support });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Failed to send reply email', error: err.message });
  }
});

module.exports = {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
  replySupportRequest,
};

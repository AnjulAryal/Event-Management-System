const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const { buildEventAnalyses, generateGeminiSummaries, isEventFeedback } = require('../utils/feedbackAnalysis');
const { createAdminNotification, createUserNotification } = require('../utils/notificationService');

const ANALYSIS_VERSION = 'feedback-analysis-v3';
const AI_CACHE_TTL_MS = 10 * 60 * 1000;
let feedbackAnalysisCache = null;

const getFeedbackSignature = (feedbacks) => {
  const latest = feedbacks.reduce((max, item) => {
    const updated = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Math.max(max, Number.isNaN(updated) ? 0 : updated);
  }, 0);

  return `${ANALYSIS_VERSION}:${feedbacks.length}:${latest}:${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`;
};

const getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find({});
  res.json(feedbacks);
};

const getFeedbackAnalysis = async (req, res) => {
  const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
  const eventFeedbacks = feedbacks.filter(isEventFeedback);
  const localEvents = buildEventAnalyses(eventFeedbacks);
  const ignoredSupportCount = feedbacks.length - eventFeedbacks.length;
  const signature = getFeedbackSignature(eventFeedbacks);
  const shouldSkipAi = ['0', 'false', 'local'].includes(String(req.query.ai || '').toLowerCase());
  const shouldRefreshAi = String(req.query.refresh || '').toLowerCase() === 'true';
  const cacheFresh = feedbackAnalysisCache
    && feedbackAnalysisCache.signature === signature
    && Date.now() - feedbackAnalysisCache.createdAt < AI_CACHE_TTL_MS;

  if (shouldSkipAi) {
    return res.json({
      generatedAt: new Date().toISOString(),
      provider: 'local-fallback',
      ignoredSupportCount,
      cached: false,
      events: localEvents,
    });
  }

  if (cacheFresh && !shouldRefreshAi) {
    return res.json({
      generatedAt: feedbackAnalysisCache.generatedAt,
      provider: feedbackAnalysisCache.provider,
      ignoredSupportCount,
      cached: true,
      events: feedbackAnalysisCache.events,
    });
  }

  try {
    const analysis = await generateGeminiSummaries(localEvents);
    feedbackAnalysisCache = {
      signature,
      createdAt: Date.now(),
      generatedAt: new Date().toISOString(),
      provider: analysis.provider,
      events: analysis.events,
    };

    res.json({
      generatedAt: feedbackAnalysisCache.generatedAt,
      provider: analysis.provider,
      ignoredSupportCount,
      cached: false,
      events: analysis.events,
    });
  } catch (error) {
    console.error('AI feedback summary failed:', error.message);
    res.json({
      generatedAt: new Date().toISOString(),
      provider: 'local-fallback',
      warning: 'AI provider failed, returned local analysis instead.',
      ignoredSupportCount,
      cached: false,
      events: localEvents,
    });
  }
};

const submitFeedback = async (req, res) => {
  const feedback = new Feedback(req.body);
  const createdFeedback = await feedback.save();

  // Send email to Admin
  try {
    await sendEmail({
      email: process.env.EMAIL_USER, // Admin's email
      subject: `New Event Feedback: ${createdFeedback.title}`,
      message: `You have received new feedback.\n\nFrom: ${createdFeedback.email}\nDate: ${createdFeedback.date}\n\nMessage:\n${createdFeedback.feedback}`,
      html: `
        <h3>New Feedback Received</h3>
        <p><strong>Event:</strong> ${createdFeedback.title}</p>
        <p><strong>From:</strong> ${createdFeedback.email}</p>
        <p><strong>Date:</strong> ${createdFeedback.date}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${createdFeedback.feedback}</p>
      `
    });
  } catch (error) {
    console.error('Email could not be sent', error);
  }

  await createAdminNotification({
    type: 'feedback_submitted',
    title: 'New feedback submitted',
    message: `${createdFeedback.email} submitted feedback for ${createdFeedback.title}.`,
    userName: createdFeedback.email,
    userEmail: createdFeedback.email,
    eventTitle: createdFeedback.title,
    feedback: createdFeedback._id,
  });

  res.status(201).json(createdFeedback);
};

const removeFeedback = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
};

const replyToFeedback = async (req, res) => {
  const { replyMessage } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  await sendEmail({
    email: feedback.email,
    subject: `Response to your feedback - ${feedback.title}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 36px 40px 28px;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Eventify Feedback</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Admin has replied to your feedback</p>
        </div>
        <div style="padding: 36px 40px;">
          <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Your feedback</p>
          <div style="background: #f8fafc; border-left: 3px solid #22c55e; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
            <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">"${feedback.feedback}"</p>
          </div>
          <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Admin response</p>
          <div style="background: #f0fdf4; border-radius: 10px; padding: 20px 24px;">
            <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.7;">${replyMessage.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      </div>
    `,
  });

  feedback.adminReply = {
    message: replyMessage.trim(),
    repliedAt: new Date(),
  };
  await feedback.save();

  const user = await User.findOne({ email: feedback.email, isAdmin: false }).select('_id');
  if (user) {
    const compactReplyKey = replyMessage.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);
    await createUserNotification({
      type: 'feedback_reply',
      recipientUser: user._id,
      title: 'Feedback response received',
      message: `Admin replied to your feedback on ${feedback.title}.`,
      eventTitle: feedback.title,
      feedback: feedback._id,
      dedupeKey: `feedback-reply:${feedback._id}:${compactReplyKey}`,
    });
  }

  res.json({ message: 'Feedback reply sent successfully', feedback });
};

const getFeedbackByEvent = async (req, res) => {
  const feedbacks = await Feedback.find({ title: req.params.title });
  res.json(feedbacks);
};

module.exports = {
  getAllFeedback,
  getFeedbackAnalysis,
  submitFeedback,
  removeFeedback,
  replyToFeedback,
  getFeedbackByEvent,
};

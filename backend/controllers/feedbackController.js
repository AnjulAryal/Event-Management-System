const Feedback = require('../models/feedbackModel');
const sendEmail = require('../utils/sendEmail');
const { buildEventAnalyses, generateGeminiSummaries, isEventFeedback } = require('../utils/feedbackAnalysis');

const AI_CACHE_TTL_MS = 10 * 60 * 1000;
let feedbackAnalysisCache = null;

const getFeedbackSignature = (feedbacks) => {
  const latest = feedbacks.reduce((max, item) => {
    const updated = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Math.max(max, Number.isNaN(updated) ? 0 : updated);
  }, 0);

  return `${feedbacks.length}:${latest}:${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`;
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

module.exports = {
  getAllFeedback,
  getFeedbackAnalysis,
  submitFeedback,
  removeFeedback,
};

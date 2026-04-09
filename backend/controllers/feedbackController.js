const Feedback = require('../models/feedbackModel');
const sendEmail = require('../utils/sendEmail');

const getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find({});
  res.json(feedbacks);
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
  submitFeedback,
  removeFeedback,
};

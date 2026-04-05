const Feedback = require('../models/feedbackModel');

const getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find({});
  res.json(feedbacks);
};

const submitFeedback = async (req, res) => {
  const feedback = new Feedback(req.body);
  const createdFeedback = await feedback.save();
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

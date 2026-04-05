const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. Tech Summit 2024
    email: { type: String, required: true }, // alex.vance@gmail.com
    date: { type: String, required: true }, // Oct 24, 2023
    feedback: { type: String, required: true } // Feedback text
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

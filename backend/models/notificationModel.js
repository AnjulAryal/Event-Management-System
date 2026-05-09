const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['event_registered', 'event_cancelled', 'feedback_submitted', 'payment_completed'],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    userName: { type: String, default: 'Unknown user' },
    userEmail: { type: String, default: '' },
    eventTitle: { type: String, default: '' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
    amount: { type: Number },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'event_registered',
        'event_cancelled',
        'feedback_submitted',
        'payment_completed',
        'new_event',
        'support_reply',
        'feedback_reply',
        'upcoming_event',
      ],
    },
    audience: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
      index: true,
    },
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    userName: { type: String, default: 'Unknown user' },
    userEmail: { type: String, default: '' },
    eventTitle: { type: String, default: '' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
    support: { type: mongoose.Schema.Types.ObjectId, ref: 'Support' },
    amount: { type: Number },
    dedupeKey: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index(
  { recipientUser: 1, dedupeKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      recipientUser: { $exists: true },
      dedupeKey: { $exists: true, $ne: '' },
    },
  }
);

module.exports = mongoose.model('Notification', notificationSchema);

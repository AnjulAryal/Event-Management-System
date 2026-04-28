const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Format matching frontend: Apr 28, 2026 or YYYY-MM-DD
    time: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: String },
    adminNotes: { type: String },
    category: { type: String, default: 'technology' },
    categoryColor: { type: String, default: '#3b99fc' },
    coverImage: { type: String },
    registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

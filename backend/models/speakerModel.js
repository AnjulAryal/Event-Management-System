const mongoose = require('mongoose');

const speakerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g. UX Director, Google
    category: { type: String, required: true }, // e.g. UI/UX Design
    bio: { type: String },
    initials: { type: String }, // Calculated as name initials
    profilePic: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Speaker', speakerSchema);

const mongoose = require('mongoose');

const speakerTopicSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SpeakerTopic', speakerTopicSchema);

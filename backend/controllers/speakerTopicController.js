const SpeakerTopic = require('../models/speakerTopicModel');

const getSpeakerTopics = async (req, res) => {
  const topics = await SpeakerTopic.find({}).sort({ name: 1 });
  res.json(topics);
};

const createSpeakerTopic = async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    res.status(400);
    throw new Error('Topic/tag name is required');
  }

  const existingTopic = await SpeakerTopic.findOne({
    name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
  });

  if (existingTopic) {
    res.status(200).json(existingTopic);
    return;
  }

  const topic = await SpeakerTopic.create({ name });
  res.status(201).json(topic);
};

module.exports = {
  getSpeakerTopics,
  createSpeakerTopic,
};

const Speaker = require('../models/speakerModel');

const getSpeakers = async (req, res) => {
  const speakers = await Speaker.find({});
  res.json(speakers);
};

const getSpeakerById = async (req, res) => {
  const speaker = await Speaker.findById(req.params.id);
  if (speaker) {
    res.json(speaker);
  } else {
    res.status(404);
    throw new Error('Speaker not found');
  }
};

const createSpeaker = async (req, res) => {
  const speaker = new Speaker(req.body);
  const createdSpeaker = await speaker.save();
  res.status(201).json(createdSpeaker);
};

const updateSpeaker = async (req, res) => {
  const speaker = await Speaker.findById(req.params.id);
  if (speaker) {
    Object.assign(speaker, req.body);
    const updatedSpeaker = await speaker.save();
    res.json(updatedSpeaker);
  } else {
    res.status(404);
    throw new Error('Speaker not found');
  }
};

const deleteSpeaker = async (req, res) => {
  const speaker = await Speaker.findById(req.params.id);
  if (speaker) {
    await speaker.deleteOne();
    res.json({ message: 'Speaker removed' });
  } else {
    res.status(404);
    throw new Error('Speaker not found');
  }
};

module.exports = {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};

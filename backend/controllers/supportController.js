const Support = require('../models/supportModel');

const submitSupportRequest = async (req, res) => {
  const support = new Support(req.body);
  const createdSupport = await support.save();
  res.status(201).json(createdSupport);
};

const getAllSupportRequests = async (req, res) => {
  const supports = await Support.find({});
  res.json(supports);
};

const updateSupportRequest = async (req, res) => {
  const support = await Support.findById(req.params.id);
  if (support) {
    support.status = req.body.status || support.status;
    const updatedSupport = await support.save();
    res.json(updatedSupport);
  } else {
    res.status(404);
    throw new Error('Support request not found');
  }
};

module.exports = {
  submitSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
};

const mongoose = require('mongoose');

const pendingRegistrationSchema = mongoose.Schema(
  {
    transaction_uuid: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationDetails: {
      name: String,
      phone: String,
      email: String
    },
    amount: { type: Number, required: true },
    status: { type: String, default: 'PENDING' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema);

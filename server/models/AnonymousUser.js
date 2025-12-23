const mongoose = require('mongoose');

const anonymousUserSchema = new mongoose.Schema({
  anonId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  deviceHash: {
    type: String,
    required: true,
    index: true
  },
  banned: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
anonymousUserSchema.index({ anonId: 1 });
anonymousUserSchema.index({ deviceHash: 1 });

module.exports = mongoose.model('AnonymousUser', anonymousUserSchema);
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    index: true
  },
  anonId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  reports: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Create TTL index for auto-expiration
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient queries
messageSchema.index({ roomCode: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
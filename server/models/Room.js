const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 6,
    maxlength: 10
  },
  roomName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create TTL index for auto-expiration
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Room', roomSchema);
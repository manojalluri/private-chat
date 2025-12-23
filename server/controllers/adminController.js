const Room = require('../models/Room');
const Message = require('../models/Message');
const AnonymousUser = require('../models/AnonymousUser');

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(rooms);
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all messages (with reports)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ reports: { $gte: 1 } })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('roomCode', 'roomName');
    
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.findByIdAndDelete(messageId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Ban a user
const banUser = async (req, res) => {
  try {
    const { anonId } = req.body;
    
    if (!anonId) {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }
    
    const user = await AnonymousUser.findOneAndUpdate(
      { anonId },
      { banned: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unban a user
const unbanUser = async (req, res) => {
  try {
    const { anonId } = req.body;
    
    if (!anonId) {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }
    
    const user = await AnonymousUser.findOneAndUpdate(
      { anonId },
      { banned: false },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Expire a room
const expireRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    
    if (!roomCode) {
      return res.status(400).json({ error: 'Room code is required' });
    }
    
    const room = await Room.findOneAndUpdate(
      { roomCode: roomCode.toUpperCase() },
      { expiresAt: new Date() },
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({ success: true, room });
  } catch (error) {
    console.error('Error expiring room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify a room
const verifyRoom = async (req, res) => {
  try {
    const { roomCode, isVerified } = req.body;
    
    if (!roomCode) {
      return res.status(400).json({ error: 'Room code is required' });
    }
    
    const room = await Room.findOneAndUpdate(
      { roomCode: roomCode.toUpperCase() },
      { isVerified: isVerified },
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({ success: true, room });
  } catch (error) {
    console.error('Error verifying room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllRooms,
  getAllMessages,
  deleteMessage,
  banUser,
  unbanUser,
  expireRoom,
  verifyRoom
};
const Room = require('../models/Room');
const AnonymousUser = require('../models/AnonymousUser');
const Message = require('../models/Message');
const crypto = require('crypto');

// Generate a unique room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { roomName, expiryType } = req.body;
    
    // Validate input
    if (!roomName || typeof roomName !== 'string' || roomName.trim().length === 0) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    
    if (!['24h', '7d'].includes(expiryType)) {
      return res.status(400).json({ error: 'Expiry type must be 24h or 7d' });
    }
    
    // Generate unique room code
    let roomCode;
    let isUnique = false;
    while (!isUnique) {
      roomCode = generateRoomCode();
      const existingRoom = await Room.findOne({ roomCode });
      if (!existingRoom) {
        isUnique = true;
      }
    }
    
    // Calculate expiry date
    const now = new Date();
    const expiryHours = expiryType === '24h' ? 24 : 7 * 24;
    const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
    
    // Create room
    const room = new Room({
      roomCode,
      roomName: roomName.trim(),
      expiresAt
    });
    
    await room.save();
    
    res.status(201).json({
      roomCode: room.roomCode,
      roomName: room.roomName,
      expiresAt: room.expiresAt
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get room details
const getRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check if room has expired
    if (room.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Room has expired' });
    }
    
    res.json({
      roomCode: room.roomCode,
      roomName: room.roomName,
      isVerified: room.isVerified,
      expiresAt: room.expiresAt,
      createdAt: room.createdAt
    });
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Join a room
const joinRoom = async (req, res) => {
  try {
    const { roomCode, anonId } = req.body;
    
    if (!roomCode || typeof roomCode !== 'string') {
      return res.status(400).json({ error: 'Room code is required' });
    }
    
    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }
    
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check if room has expired
    if (room.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Room has expired' });
    }
    
    // Check if user is banned
    const user = await AnonymousUser.findOne({ anonId });
    if (user && user.banned) {
      return res.status(403).json({ error: 'User is banned' });
    }
    
    // Create user if doesn't exist
    if (!user) {
      const deviceHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
      await AnonymousUser.create({ anonId, deviceHash });
    }
    
    res.json({
      roomCode: room.roomCode,
      roomName: room.roomName,
      isVerified: room.isVerified
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check room expiry
const checkRoomExpiry = async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const isExpired = room.expiresAt < new Date();
    
    res.json({
      isExpired,
      expiresAt: room.expiresAt,
      roomName: room.roomName
    });
  } catch (error) {
    console.error('Error checking room expiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createRoom,
  getRoom,
  joinRoom,
  checkRoomExpiry
};
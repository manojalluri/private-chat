const Message = require('../models/Message');
const Room = require('../models/Room');
const AnonymousUser = require('../models/AnonymousUser');
const Filter = require('bad-words');
const filter = new Filter();

// Store active room connections
const roomConnections = new Map();

// Rate limiting store (in-memory, would use Redis in production)
const rateLimitStore = new Map();

// Initialize socket handlers
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('join-room', async (data) => {
      try {
        const { roomCode, anonId } = data;

        if (!roomCode || !anonId) {
          socket.emit('error', { message: 'Room code and anonymous ID are required' });
          return;
        }

        // Verify room exists and hasn't expired
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.expiresAt < new Date()) {
          socket.emit('room-expired', { roomCode });
          return;
        }

        // Check if user is banned
        const user = await AnonymousUser.findOne({ anonId });
        if (user && user.banned) {
          socket.emit('user-banned', { message: 'You are banned from this room' });
          return;
        }

        // Join the room
        socket.join(roomCode);
        
        // Track connection
        if (!roomConnections.has(roomCode)) {
          roomConnections.set(roomCode, new Set());
        }
        roomConnections.get(roomCode).add(socket.id);

        // Send success response
        socket.emit('joined-room', { 
          roomCode, 
          roomName: room.roomName,
          isVerified: room.isVerified
        });

        // Get recent messages
        const messages = await Message.find({ roomCode })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        // Send recent messages in reverse order (oldest first)
        socket.emit('recent-messages', messages.reverse());

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave-room', (data) => {
      const { roomCode } = data;
      if (roomCode) {
        socket.leave(roomCode);
        
        // Clean up connection tracking
        if (roomConnections.has(roomCode)) {
          roomConnections.get(roomCode).delete(socket.id);
          if (roomConnections.get(roomCode).size === 0) {
            roomConnections.delete(roomCode);
          }
        }
      }
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { roomCode, anonId, content } = data;

        if (!roomCode || !anonId || !content) {
          socket.emit('error', { message: 'Room code, anonymous ID, and content are required' });
          return;
        }

        // Rate limiting per anonId
        const rateLimitKey = `${anonId}:${roomCode}`;
        const now = Date.now();
        const windowMs = 10000; // 10 seconds
        const maxMessages = 5;

        if (!rateLimitStore.has(rateLimitKey)) {
          rateLimitStore.set(rateLimitKey, []);
        }

        const timestamps = rateLimitStore.get(rateLimitKey);
        const recentMessages = timestamps.filter(timestamp => now - timestamp < windowMs);
        
        if (recentMessages.length >= maxMessages) {
          socket.emit('error', { message: 'Rate limit exceeded. Please slow down.' });
          return;
        }

        // Add current timestamp
        recentMessages.push(now);
        rateLimitStore.set(rateLimitKey, recentMessages);

        // Check if user is banned
        const user = await AnonymousUser.findOne({ anonId });
        if (user && user.banned) {
          socket.emit('user-banned', { message: 'You are banned from this room' });
          return;
        }

        // Verify room exists and hasn't expired
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
        if (!room || room.expiresAt < new Date()) {
          socket.emit('room-expired', { roomCode });
          return;
        }

        // Sanitize content
        const sanitizedContent = filter.clean(content.trim());

        // Validate content
        if (sanitizedContent.length === 0) {
          socket.emit('error', { message: 'Message content is required' });
          return;
        }

        if (sanitizedContent.length > 1000) {
          socket.emit('error', { message: 'Message too long' });
          return;
        }

        // Calculate expiry (24 hours from now)
        const nowDate = new Date();
        const expiresAt = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);

        // Create message
        const message = new Message({
          roomCode,
          anonId,
          content: sanitizedContent,
          expiresAt
        });

        await message.save();

        // Emit to all in room
        io.to(roomCode).emit('new-message', {
          _id: message._id,
          roomCode: message.roomCode,
          anonId: message.anonId,
          content: message.content,
          createdAt: message.createdAt,
          expiresAt: message.expiresAt
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Edit message
    socket.on('edit-message', async (data) => {
      try {
        const { messageId, content, anonId } = data;

        if (!messageId || !content || !anonId) {
          socket.emit('error', { message: 'Message ID, content, and anonymous ID are required' });
          return;
        }

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check ownership
        if (message.anonId !== anonId) {
          socket.emit('error', { message: 'Not authorized to edit this message' });
          return;
        }

        // Check if message is too old (2 minutes limit)
        const timeDiff = Date.now() - message.createdAt.getTime();
        if (timeDiff > 2 * 60 * 1000) { // 2 minutes in milliseconds
          socket.emit('error', { message: 'Cannot edit message after 2 minutes' });
          return;
        }

        // Sanitize content
        const sanitizedContent = filter.clean(content.trim());

        if (sanitizedContent.length === 0) {
          socket.emit('error', { message: 'Message content is required' });
          return;
        }

        // Update message
        message.content = sanitizedContent;
        await message.save();

        // Emit to all in room
        io.to(message.roomCode).emit('message-edited', {
          _id: message._id,
          content: message.content,
          updatedAt: message.updatedAt || new Date()
        });

      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('delete-message', async (data) => {
      try {
        const { messageId, anonId } = data;

        if (!messageId || !anonId) {
          socket.emit('error', { message: 'Message ID and anonymous ID are required' });
          return;
        }

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check ownership
        if (message.anonId !== anonId) {
          socket.emit('error', { message: 'Not authorized to delete this message' });
          return;
        }

        // Check if message is too old (2 minutes limit)
        const timeDiff = Date.now() - message.createdAt.getTime();
        if (timeDiff > 2 * 60 * 1000) { // 2 minutes in milliseconds
          socket.emit('error', { message: 'Cannot delete message after 2 minutes' });
          return;
        }

        // Delete message
        await Message.findByIdAndDelete(messageId);

        // Emit to all in room
        io.to(message.roomCode).emit('message-deleted', {
          _id: message._id
        });

      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Report message
    socket.on('report-message', async (data) => {
      try {
        const { messageId, anonId } = data;

        if (!messageId || !anonId) {
          socket.emit('error', { message: 'Message ID and anonymous ID are required' });
          return;
        }

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Increment report count
        message.reports += 1;
        await message.save();

        // Check if message should be hidden (threshold: 3 reports)
        if (message.reports >= 3) {
          // Emit message hidden to all in room
          io.to(message.roomCode).emit('message-hidden', {
            _id: message._id
          });
        }

        // Emit report confirmation to sender
        socket.emit('message-reported', { success: true });

      } catch (error) {
        console.error('Error reporting message:', error);
        socket.emit('error', { message: 'Failed to report message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Clean up connection tracking
      for (const [roomCode, connections] of roomConnections.entries()) {
        connections.delete(socket.id);
        if (connections.size === 0) {
          roomConnections.delete(roomCode);
        }
      }
    });
  });
};

module.exports = { setupSocketHandlers };
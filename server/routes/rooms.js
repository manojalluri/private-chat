const express = require('express');
const { 
  createRoom, 
  getRoom, 
  joinRoom, 
  checkRoomExpiry 
} = require('../controllers/roomController');
const { rateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/create', rateLimiter, createRoom);
router.get('/:roomCode', getRoom);
router.post('/join', rateLimiter, joinRoom);
router.get('/check-expiry/:roomCode', checkRoomExpiry);

module.exports = router;
const express = require('express');
const { 
  getAllRooms, 
  getAllMessages, 
  deleteMessage, 
  banUser, 
  unbanUser, 
  expireRoom, 
  verifyRoom 
} = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/adminAuth');

const router = express.Router();

router.get('/rooms', adminAuth, getAllRooms);
router.get('/messages', adminAuth, getAllMessages);
router.delete('/messages/:messageId', adminAuth, deleteMessage);
router.post('/users/ban', adminAuth, banUser);
router.post('/users/unban', adminAuth, unbanUser);
router.post('/rooms/expire', adminAuth, expireRoom);
router.post('/rooms/verify', adminAuth, verifyRoom);

module.exports = router;
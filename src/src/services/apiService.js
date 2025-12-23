import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
const apiService = {
  // Room API
  createRoom: (data) => api.post('/rooms/create', data),
  getRoom: (roomCode) => api.get(`/rooms/${roomCode}`),
  joinRoom: (data) => api.post('/rooms/join', data),
  checkRoomExpiry: (roomCode) => api.get(`/rooms/check-expiry/${roomCode}`),

  // Admin API
  getAllRooms: (adminSecret) => 
    api.get('/admin/rooms', { headers: { 'x-admin-secret': adminSecret } }),
  getAllMessages: (adminSecret) => 
    api.get('/admin/messages', { headers: { 'x-admin-secret': adminSecret } }),
  deleteMessage: (messageId, adminSecret) => 
    api.delete(`/admin/messages/${messageId}`, { headers: { 'x-admin-secret': adminSecret } }),
  banUser: (data, adminSecret) => 
    api.post('/admin/users/ban', data, { headers: { 'x-admin-secret': adminSecret } }),
  unbanUser: (data, adminSecret) => 
    api.post('/admin/users/unban', data, { headers: { 'x-admin-secret': adminSecret } }),
  expireRoom: (data, adminSecret) => 
    api.post('/admin/rooms/expire', data, { headers: { 'x-admin-secret': adminSecret } }),
  verifyRoom: (data, adminSecret) => 
    api.post('/admin/rooms/verify', data, { headers: { 'x-admin-secret': adminSecret } }),
};

export default apiService;
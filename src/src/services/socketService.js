import { io } from 'socket.io-client';

let socket;

const connectSocket = () => {
  const url = import.meta.env.VITE_API_URL || undefined;
  socket = io(url);
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const getSocket = () => {
  return socket;
};

// Socket event handlers
const on = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

const off = (event) => {
  if (socket) {
    socket.off(event);
  }
};

// Emit events
const emit = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
};

export {
  connectSocket,
  disconnectSocket,
  getSocket,
  on,
  off,
  emit
};
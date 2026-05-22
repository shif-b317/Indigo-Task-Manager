import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL);

  socket.on('connect', () => {
    console.log('Socket connected successfully:', socket.id);
    if (userId) {
      socket.emit('join_user_room', userId);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

export const getSocket = () => socket;
export default socket;

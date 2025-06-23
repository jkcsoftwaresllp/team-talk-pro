import registerChatHandlers from './chat.events.js';
import { registerTypingHandlers } from './typing.socket.js';
import registerPresenceHandlers from './presence.events.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Register individual socket event modules
    registerChatHandlers(socket, io);
    registerTypingHandlers(socket, io);
    registerPresenceHandlers(socket, io);

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
};

import { createMessage } from '../services/message/createMessage.service.js';

export default function registerChatHandlers(socket, io) {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', async ({ chatId, content }) => {
    const senderId = socket.userId; // set from auth middleware if used

    if (!chatId || !content || !senderId) return;

    try {
      // Save to DB
      const message = await createMessage({ chatId, senderId, content });

      // Broadcast to room
      io.to(chatId).emit('receive_message', {
        ...message,
        timestamp: new Date().toISOString()
      });

      console.log(`💾 Message saved & broadcasted in ${chatId}`);
    } catch (err) {
      console.error('❌ Failed to send message via socket:', err);
      socket.emit('error_message', 'Message send failed');
    }
  });
}

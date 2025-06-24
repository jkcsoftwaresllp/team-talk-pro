export const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join a chat room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room ${roomId}`);
    });

    // Handle chat message
    socket.on('chatMessage', ({ roomId, message, sender }) => {
      console.log(`Room ${roomId} | ${sender}: ${message}`);
      io.to(roomId).emit('receiveMessage', { sender, message });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

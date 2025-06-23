export function registerTypingHandlers(socket, io) {
  socket.on('typing:start', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing:start', { chatId, userId });
  });

  socket.on('typing:stop', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing:stop', { chatId, userId });
  });
}

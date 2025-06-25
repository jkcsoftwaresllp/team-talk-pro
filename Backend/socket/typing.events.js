export default function registerTypingHandlers(socket, io) {
  socket.on('typing', (roomId) => {
    socket.to(roomId).emit('user_typing', socket.id);
  });

  socket.on('stop_typing', (roomId) => {
    socket.to(roomId).emit('user_stopped_typing', socket.id);
  });
}

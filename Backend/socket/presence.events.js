const onlineUsers = new Map(); // userId -> Set of socket IDs

export default function registerPresenceHandlers(socket, io) {
  socket.on('presence:online', ({ userId }) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    socket.userId = userId; // Store for cleanup on disconnect

    // Notify others
    socket.broadcast.emit('presence:update', {
      userId,
      status: 'online',
    });
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (!userId) return;

    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);

        // Notify others
        socket.broadcast.emit('presence:update', {
          userId,
          status: 'offline',
        });
      }
    }
  });
}


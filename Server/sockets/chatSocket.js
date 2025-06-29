import { Server } from 'socket.io';
import { saveMessage, updateMessageStatus } from '../models/messageModel.js';

let ioInstance;
const onlineUsers = new Map(); // userId => socketId

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST'],
      credentials: true
    
    }
  });
  ioInstance.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // On user login / presence
    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit('userStatus', { userId, isOnline: true });
    });

    // Join a chat room
    socket.on('joinRoom', (chatId) => {
      socket.join(chatId);
    });

    // Typing indicator
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { chatId, userId });
    });

    socket.on('stopTyping', ({ chatId, userId }) => {
      socket.to(chatId).emit('stopTyping', { chatId, userId });
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      const message = await saveMessage(data);
      ioInstance.to(data.chat_id).emit('receiveMessage', message);
      
       // Notify all users in chat except sender
  socket.to(data.chat_id).emit('newNotification', {
    chat_id: data.chat_id,
    message,
  });
    });

    // Seen / Delivered
    socket.on('seenMessage', async ({ message_id, chat_id }) => {
      await updateMessageStatus(message_id, 'seen');
      ioInstance.to(chat_id).emit('messageSeen', { message_id });
    });

    socket.on('deliveredMessage', async ({ message_id, chat_id }) => {
      await updateMessageStatus(message_id, 'delivered');
      ioInstance.to(chat_id).emit('messageDelivered', { message_id });
    });

    // On disconnect
    socket.on('disconnect', () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('userStatus', { userId, isOnline: false });
          break;
        }
      }
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};
export const getIO = () => ioInstance;

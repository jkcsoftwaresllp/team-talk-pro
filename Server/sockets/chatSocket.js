import { Server } from 'socket.io';
import { saveMessage, updateMessageStatus } from '../models/messageModel.js';

let ioInstance; // global reference

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on('joinRoom', (chatId) => {
      socket.join(chatId);
      console.log(`User joined room ${chatId}`);
    });

    socket.on('sendMessage', async (data) => {
      const message = await saveMessage(data);
      ioInstance.to(data.chat_id).emit('receiveMessage', message);
    });

    socket.on('seenMessage', async ({ message_id, chat_id }) => {
      await updateMessageStatus(message_id, 'seen');
      ioInstance.to(chat_id).emit('messageSeen', { message_id });
    });

    socket.on('deliveredMessage', async ({ message_id, chat_id }) => {
      await updateMessageStatus(message_id, 'delivered');
      ioInstance.to(chat_id).emit('messageDelivered', { message_id });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

//  Export to use in controllers
export const getIO = () => ioInstance;

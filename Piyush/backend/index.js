import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from "socket.io";
import { createServer } from "http";
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import userlistRouter from './routes/userlist.routes.js';
import messageModel from './models/message.model.js';
import './config/createUserTable.js';
import './config/createMessageTable.js';
import './config/createUserListTable.js';
import mysql_db from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('register', (data) => {
    const { user_id } = data;
    if (user_id) {
      const userIdStr = user_id.toString();
      onlineUsers.set(userIdStr, socket.id);
      socket.join(userIdStr);
      console.log(`User ${userIdStr} registered with socket ${socket.id}`);
      console.log('Online users:', [...onlineUsers.entries()]);
    }
  });

  socket.on('message', async (data) => {
    const { sender_id, receiver_id, text } = data;
    console.log('Message received:', { sender_id, receiver_id, text });

    try {
      // Validate that both users exist before creating message
      const db = await mysql_db();
      
      const [senderCheck] = await db.execute('SELECT id FROM users WHERE id = ?', [parseInt(sender_id)]);
      const [receiverCheck] = await db.execute('SELECT id FROM users WHERE id = ?', [parseInt(receiver_id)]);
      
      if (senderCheck.length === 0) {
        console.error(`Sender with ID ${sender_id} does not exist`);
        socket.emit('error', { message: `Sender with ID ${sender_id} does not exist` });
        await db.end();
        return;
      }
      
      if (receiverCheck.length === 0) {
        console.error(`Receiver with ID ${receiver_id} does not exist`);
        socket.emit('error', { message: `Receiver with ID ${receiver_id} does not exist` });
        await db.end();
        return;
      }
      
      await db.end();

      // Now create the message
      const messageId = await messageModel.createMessage({
        sender_id: parseInt(sender_id),
        receiver_id: parseInt(receiver_id),
        text,
        image: null
      });

      // Get fresh connection for fetching message
      const db2 = await mysql_db();
      const [messages] = await db2.execute('SELECT * FROM messages WHERE id = ?', [messageId]);
      await db2.end();
      
      const savedMessage = messages[0];
      const messageToSend = {
        ...savedMessage,
        time: new Date(savedMessage.created_at).toLocaleTimeString()
      };

      // Emit to sender
      const senderSocketId = onlineUsers.get(sender_id.toString());
      if (senderSocketId) {
        io.to(sender_id.toString()).emit('receive-message', messageToSend);
        console.log(`Emitted to sender ${sender_id}`);
      }

      // Emit to receiver
      const receiverSocketId = onlineUsers.get(receiver_id.toString());
      if (receiverSocketId) {
        io.to(receiver_id.toString()).emit('receive-message', messageToSend);
        console.log(`Emitted to receiver ${receiver_id}`);
      }
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    for (let [user_id, socket_id] of onlineUsers.entries()) {
      if (socket_id === socket.id) {
        onlineUsers.delete(user_id);
        console.log(`User ${user_id} removed from onlineUsers`);
        break;
      }
    }
    console.log('Updated online users:', [...onlineUsers.entries()]);
  });
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/userlist', userlistRouter);

app.get('/', (req, res) => {
  res.send("🚀 Backend is working!");
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


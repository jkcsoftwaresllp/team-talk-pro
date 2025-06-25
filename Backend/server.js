import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from './socket/socket.js'; // 👈 Modular socket logic

// Load environment variables
dotenv.config();

// DB connection
import { db } from './config/db.js';

// Routes
import publicRoutes from './routes/public.routes.js';
import privateRoutes from './routes/private.routes.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', publicRoutes);
app.use('/api', privateRoutes);

// DB test
try {
  await db.query('SELECT 1');
  console.log('✅ MySQL connected');
} catch (err) {
  console.error('❌ DB connection failed:', err);
}

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});

app.set('io', io); // ✅ Expose io to controllers
initSocket(io);     // ✅ Load all socket handlers

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

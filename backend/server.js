import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { AppContainer } from './config/app.js';
import { createAuthRoutes } from './src/routes/authRoutes.js';
import { ErrorMiddleware } from './src/middleware/ErrorMiddleware.js';
import { Response } from './src/utils/Response.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});


const container = new AppContainer();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', createAuthRoutes(
  container.get('authController'),
  container.get('authMiddleware')
));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbService = container.get('databaseService');
  const dbConnected = await dbService.testConnection();
  
  res.json(Response.success('TeamTalk Pro+ Backend is running!', {
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  }));
});

// Error handling middleware
app.use(ErrorMiddleware.handle);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 TeamTalk Pro+ Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  
  // Test database connection
  const dbService = container.get('databaseService');
  const dbStatus = await dbService.testConnection();
  console.log(`🗄️  Database: ${dbStatus ? 'Connected' : 'Disconnected'}`);
});

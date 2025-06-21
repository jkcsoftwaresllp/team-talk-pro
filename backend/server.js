import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import db, { checkConnection } from './config/database.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  const dbConnected = await checkConnection();
  
  res.json({ 
    status: 'OK', 
    message: 'TeamTalk Pro+ Backend is running!',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Database-specific health check
app.get('/api/health/db', async (req, res) => {
  try {
    const [result] = await db.execute('SELECT 1 as test');
    res.json({
      status: 'Connected',
      message: 'Database connection is healthy',
      test_query: result[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

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
  console.log(` TeamTalk Pro+ Backend running on port ${PORT}`);
  console.log(` Socket.IO server ready`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  
  // Check database connection on startup
  const dbStatus = await checkConnection();
  if (dbStatus) {
    console.log(' Database connection verified');
  } else {
    console.log('  Database connection issues detected');
  }
});

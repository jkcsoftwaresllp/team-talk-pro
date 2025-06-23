import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './Server/routes/authRoutes.js';
import { initSocket } from './Server/sockets/chatSocket.js';
import chatRoutes from './Server/routes/chatRoutes.js';
import fileRoutes from './Server/routes/fileRoutes.js';
import path from 'path';



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static(path.resolve('./uploads')));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

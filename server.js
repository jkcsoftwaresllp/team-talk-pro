import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoute.js';
import userRoutes from './src/routes/userRoutes.js';
import { config } from 'dotenv';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 10;

config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
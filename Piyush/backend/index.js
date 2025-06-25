import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import mysql_db from './config/db.js';
import './config/createUserTable.js';
import './config/createUserTable.js';


dotenv.config(); 

const db = await mysql_db();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send("🚀 Backend is working!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

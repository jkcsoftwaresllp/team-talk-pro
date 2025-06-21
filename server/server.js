const express =require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const app =express();
require('dotenv').config();
const authRoutes=require('./routes/authRoutes');
const db =require ('./config/db');
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use('./api/auth',authRoutes);
const PORT=process.env.PORT|| 5000;
app.listen(PORT,()=>console.log(`server runing on port ${PORT}`));
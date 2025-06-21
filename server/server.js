// const express =require('express');
// const cookieParser=require('cookie-parser');
// const cors=require('cors');
// const app =express();
// require('dotenv').config();
// const authRoutes=require('./routes/authRoutes');
// const db =require ('./config/db');
// app.use(cors({
//     origin:'http://localhost:3000',
//     credentials:true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use('./api/auth',authRoutes);
// const PORT=process.env.PORT|| 5000;
// app.listen(PORT,()=>console.log(`server runing on port ${PORT}`));
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
require("dotenv").config();
const authRoutes=require('./routes/authRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const db =require('./config/db');
const app =express();
const server =http.createServer(app);
const io=new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        credentials:true
    }
});
const connectedUsers={};
io.on('connection',(Socket)=>{
    console.log('User-connected:',Socket.id);
    Socket.on('join_chat',({userId,chatId})=>{
        Socket.join(chatId);
        connectedUsers[Socket.id]=userId;
    });
    Socket.on('send_message',(message)=>{
        const {chatId,senderId,content}=message;
        const sql='INSERT INTO messages(chat_id,senderId,content)VALUES(?,?,?)';
        db.query(sql,[chat_id,sender_id,content],(err,result)=>{
            if(err)return;
            const savedMsg={id:result.insertId, ...message};
            io.to(chatId).emit('receive_message',savedMsg);
        });


    });
    Socket.on('disconnect',()=>{
        delete connectedUsers[Socket.id];
        console.log('User disconnected:',Socket.id);
    });

});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env variables
dotenv.config();

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB & Routes
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    console.log(`${userData.username} joined their private room`);
    socket.emit("connected");
  });

  socket.on("join_chat", ({ chatId }) => {
    socket.join(`chat_${chatId}`);
  });

  socket.on("send_message", (msg) => {
    io.to(`chat_${msg.chatId}`).emit("message received", msg);
  });

  socket.on("react_message", ({ msgId, emoji }) => {
    io.emit("message_reacted", { msgId, emoji });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

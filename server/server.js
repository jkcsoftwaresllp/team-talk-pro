import http from 'http';
import app from './src/app.js';
import { Server } from 'socket.io';
import { handleSocketConnection } from './src/sockets/chatSocket.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    credentials: true
  }
});

// Attach chat socket logic
handleSocketConnection(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

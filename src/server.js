require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const prisma = require('./prisma');

const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Allow Cross-Origin Requests from frontend (Amplify, localhost, etc.)
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000;

// Health check endpoint for monitoring & Nginx testing
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. Join a specific room (and leave old room if switching)
  socket.on('join_room', async ({ room, oldRoom, username }) => {
    if (oldRoom && oldRoom !== room) {
      socket.leave(oldRoom);
    }
    socket.join(room);
    console.log(`👤 ${username || socket.id} joined room: [${room}]`);

    // Fetch DB history for this specific room
    try {
      const history = await prisma.message.findMany({
        where: { room },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });
      socket.emit('load_history', history);
    } catch (err) {
      console.warn('DB read error:', err.message);
    }
  });

  // 2. Send message: save to DB & broadcast ONLY to that specific room
  socket.on('send_message', async ({ room, sender, content }) => {
    if (!content || !content.trim()) return;

    let messageData = { room, sender, content: content.trim(), createdAt: new Date() };

    try {
      messageData = await prisma.message.create({
        data: { room, sender, content: content.trim() },
      });
    } catch (err) {
      console.warn('DB save error:', err.message);
    }

    // io.to(room) sends exclusively to sockets inside this room
    io.to(room).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

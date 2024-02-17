const express = require('express');
const cors = require('cors')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3001"
  }
});

app.use(cors())

app.get('/', (req, res) => {
  res.send("<p>hello!</p>");
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
    socket.on('chatmsg', (msg) => {
        socket.emit("chatmsgserver", msg)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
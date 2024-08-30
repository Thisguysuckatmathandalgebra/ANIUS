const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let onlineUsers = 0;

app.use(express.static(path.join(__dirname)));

// Handle a GET request to the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('user count', onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('user count', onlineUsers);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public')); // Serve static files from the 'public' folder

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data.message);
    // Broadcast the message to all connected clients
    io.emit('message', { message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
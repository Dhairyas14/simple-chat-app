const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(__dirname));

// Keep track of sent messages
const sentMessages = new Set();

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for new user events
    socket.on('newUser', (username) => {
        // Broadcast the new user to all connected clients
        io.emit('newUser', username);
    });
    
    // Listen for messages
    socket.on('message', (message) => {
        if (!sentMessages.has(message)) {
            // Broadcast the message to all connected clients
            io.emit('message', { message });
            sentMessages.add(message);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
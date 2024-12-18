const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (roomID) => {
        socket.join(roomID);
        socket.to(roomID).emit('user-connected', socket.id);

        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', socket.id);
        });

        socket.on('signal', (data) => {
            io.to(data.target).emit('signal', { sender: socket.id, signal: data.signal });
        });
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  // Event to create a new room
  socket.on('create-room', () => {
    const roomId = Math.random().toString(36).substr(2, 9);
    rooms[roomId] = { creator: socket.id, participants: [] };
    socket.join(roomId);
    socket.emit('room-created', roomId);
    console.log(`Room created with ID: ${roomId}`);
  });

  // Event to request joining a room
  socket.on('join-room-request', ({ roomId, username }) => {
    if (rooms[roomId]) {
      io.to(rooms[roomId].creator).emit('join-room-request', { roomId, username, requesterId: socket.id });
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  // Event to approve join request
  socket.on('approve-join', ({ roomId, username, requesterId }) => {
    if (rooms[roomId] && rooms[roomId].creator === socket.id) {
      const participant = { id: requesterId, username, joinedAt: Date.now() };
      rooms[roomId].participants.push(participant);
      io.to(requesterId).emit('join-room-approved', roomId);
      console.log(`${username} approved to join room: ${roomId}`);
    } else {
      socket.emit('error', 'Only the room creator can approve join requests');
    }
  });

  // Event to join a room
  socket.on('join-room', ({ roomId, username }) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      io.to(roomId).emit('participant-joined', username);
      console.log(`${username} joined room: ${roomId}`);
    } else {
      console.log("Error")
      socket.emit('error', 'Room not found');
    }
  });

  // Event to handle workspace changes
// Event to handle workspace changes
// Event to handle workspace changes
socket.on('workspace-change', (data) => {
  if (rooms[data.roomId]) {
    console.log('Received workspace-change:', data);
    socket.to(data.roomId).emit('workspace-change', data);
  } else {
    socket.emit('error', 'Room not found');
  }
});



  // Event to handle text changes
  socket.on('text-change', (data) => {
    if (rooms[data.roomId]) {
      socket.to(data.roomId).emit('text-change', data);
      console.log(`Text change broadcasted to room ${data.roomId}`);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  // Event to handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const roomId in rooms) {
      if (rooms[roomId].creator === socket.id) {
        delete rooms[roomId]; // Remove the room if the creator disconnects
        io.to(roomId).emit('error', 'Room creator has disconnected. Room will be closed.');
        io.in(roomId).socketsLeave(roomId); // Forcefully remove all participants from the room
      } else {
        const index = rooms[roomId].participants.findIndex(p => p.id === socket.id);
        if (index > -1) {
          const [participant] = rooms[roomId].participants.splice(index, 1);
          io.to(roomId).emit('participant-left', participant.username);
          console.log(`${participant.username} left room ${roomId}`);
        }
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

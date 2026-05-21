import { Server, Socket } from 'socket.io';

let io;
let activeSocket;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    activeSocket = socket;
  });

  return io;
}

export function getIO() {
  return io;
}

export function getSocket() {
  return activeSocket;
}
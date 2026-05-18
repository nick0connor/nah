import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from 'path';

import { createServer } from 'node:http';
import { initSocket } from "./socket.mjs";
import settingsRouter from './routes/settings.mjs';
import searchRouter from './routes/search.mjs';
import torrentRouter from './routes/torrent.mjs'

const app = express();
app.use(cors());
app.use(express.json());
app.use('/settings', settingsRouter);
app.use('/', searchRouter);
app.use('/', torrentRouter);

const server = createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
  console.log("Client connected");

  socket.on('disconnect', () => {
    console.log('Client used a stun (disconnected)');
  })
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
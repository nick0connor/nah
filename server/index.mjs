import express, { response } from "express";
import cors from "cors";
import TorrentSearchApi from 'torrent-search-api';
import WebTorrent from "webtorrent";
import { Server } from "socket.io";
import { createServer } from 'node:http';

import config from '../config.paths.json' with { type: 'json' };

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const torrentClient = new WebTorrent();

TorrentSearchApi.enablePublicProviders();
var mostRecentTorrent = [];
var mediaType = null;

io.on('connection', (socket) => {
  console.log("Client connected");

  socket.on('disconnect', () => {
    console.log('Client used a stun (disconnected)');
  })
});

app.get('/', (req, res) => {
  res.send('<h1>Server Active</h1>');
}); 

app.post("/search", async (req, res) => {
  const query = req.body.query;
  // mediaType = (req.body.media == "movie") ? "Movies" : "TV";

  console.log(`Received ${req.body.media}: '${query}'`)

  mostRecentTorrent = await TorrentSearchApi.search(query, mediaType, 20);

  res.json(mostRecentTorrent);
});


function addTorrentAsync(torrentClient, magnet) {
  return new Promise((resolve, reject) => {
    torrentClient.add(magnet, { path: config[mediaType] }, (torrent) => {

      torrent.on('download', () => {
        const progress = (torrent.progress * 100).toFixed(2);
        const speed = (torrent.downloadSpeed / 1048576).toFixed(2);
        
        io.emit("progress", {
          infoHash: torrent.infoHash,
          progress: progress,
          speed: speed
        });

        process.stdout.write(`\rProgress: ${progress}% | Speed: ${speed} MB/s`)
      });

      torrent.on("done", () => {
        process.stdout.write("\n");
        console.log("Download complete:", torrent.infoHash);
      });

      torrent.on("error", reject);

      resolve(torrent);
    });
  })
}

app.post("/confirm", async (req, res) => {
  if(!mostRecentTorrent || mostRecentTorrent.length === 0) {
    return res.status(400).json({ error: "No active torrent(s)" });
  }

  const selected = mostRecentTorrent[parseInt(req.body.index)];
  const magnet = await TorrentSearchApi.getMagnet(selected);

  try {
    const torrent = await addTorrentAsync(torrentClient, magnet);
    console.log(`Downloading ${torrent.infoHash}`);

    res.json({
      response: "started",
      infoHash: torrent.infoHash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start torrent" });
  }
});

app.post("/cancel", (req, res) => {
  console.log("\nCANCEL!!");
  
  const torrent = torrentClient.get(req.body.infoHash);

  if(!torrent){
    return res.status(404).json({ error: "Could not find torrent to cancel" });
  }

  try {
    torrentClient.destroy();
    res.json({ response: "destroyed" });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "Torrent exists, failed to cancel" });
  }
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
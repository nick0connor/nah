import express, { response } from "express";
import cors from "cors";
import TorrentSearchApi from 'torrent-search-api';
import WebTorrent from "webtorrent";

import config from '../config.paths.json' with { type: 'json' };

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

const client = new WebTorrent();

TorrentSearchApi.enablePublicProviders();
var mostRecentTorrent = [];
var mediaType = null;

app.post("/search", async (req, res) => {
  const query = req.body.query;
  mediaType = (req.body.media == "movie") ? "Movies" : "TV";

  console.log(`Received ${mediaType}: '${query}'`)

  mostRecentTorrent = await TorrentSearchApi.search(query, mediaType, 20);

  res.json(mostRecentTorrent);
});


function addTorrentAsync(client, magnet) {
  return new Promise((resolve, reject) => {
    client.add(magnet, { path: config[mediaType] }, (torrent) => {

      torrent.on('download', () => {
        const progress = (torrent.progress * 100).toFixed(2);
        const speed = (torrent.downloadSpeed / 1048576).toFixed(2);

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
    const torrent = await addTorrentAsync(client, magnet);
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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
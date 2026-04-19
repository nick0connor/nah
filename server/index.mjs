import express from "express";
import cors from "cors";
import TorrentSearchApi from 'torrent-search-api';

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

TorrentSearchApi.enablePublicProviders();
var mostRecentTorrent = [];

app.post("/search", async (req, res) => {
  const query = req.body.query;
  const mediaType = (req.body.media == "movie") ? "Movies" : "TV";

  console.log(`Received ${mediaType}: '${query}'`)

  mostRecentTorrent = await TorrentSearchApi.search(query, mediaType, 20);

  res.json(mostRecentTorrent);
});

app.post("/confirm", async (req, res) => {
  if(!mostRecentTorrent || mostRecentTorrent.length === 0) {
    return res.status(400).json({ error: "No active torrent(s)" });
  }

  const selected = mostRecentTorrent[parseInt(req.body.index)];
  const magnet = await TorrentSearchApi.getMagnet(selected);

  res.json({response: "success", magnet: magnet});
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
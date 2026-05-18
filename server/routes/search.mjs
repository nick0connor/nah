import express from "express";
import TorrentSearchApi from 'torrent-search-api';

const router = express.Router();

TorrentSearchApi.enablePublicProviders();
var mostRecentTorrent = [];
var mediaType = null;

router.post("/search", async (req, res) => {
  const query = req.body.query;
  mediaType = req.body.media;

  console.log(`Received ${mediaType}: '${query}'`)

  mostRecentTorrent = await TorrentSearchApi.search(query, mediaType, 20);

  res.json(mostRecentTorrent);
});

export default router;
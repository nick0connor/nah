import express from "express";
import TorrentSearchApi from 'torrent-search-api';
import { mostRecentTorrent, mediaType, setMostRecentTorrent, setMediaType } from "../state.mjs";

const router = express.Router();

TorrentSearchApi.enablePublicProviders();

router.post("/search", async (req, res) => {
  const query = req.body.query;
  setMediaType(req.body.media);

  console.log(`Received ${mediaType}: '${query}'`)

  setMostRecentTorrent(await TorrentSearchApi.search(query, mediaType, 20));

  res.json(mostRecentTorrent);
});

export default router;
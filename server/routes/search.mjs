import express from "express";
import TorrentSearchApi from "../TorrentSearchApi.mjs";
import { mostRecentTorrent, mediaType, setMostRecentTorrent, setMediaType } from "../state.mjs";

const router = express.Router();

router.post("/search", async (req, res) => {
  const query = req.body.query;
  setMediaType(req.body.media);

  console.log(`Received ${mediaType}: '${query}'`)

  setMostRecentTorrent(await TorrentSearchApi.search(query, mediaType, 20));

  res.json(mostRecentTorrent);
});

export default router;
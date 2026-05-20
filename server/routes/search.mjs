import express from "express";
import TorrentSearchApi from "../TorrentSearchApi.mjs";
import { mostRecentTorrent, mediaType, setMostRecentTorrent, setMediaType } from "../state.mjs";

const router = express.Router();

router.get("/search", async (req, res) => {
  const title = req.query.title;
  setMediaType(req.query.media);

  console.log(`Received ${mediaType}: '${title}'`)

  setMostRecentTorrent(await TorrentSearchApi.search(title, mediaType, 20));

  res.json(mostRecentTorrent);
});

export default router;
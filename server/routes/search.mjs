import express from "express";
import TorrentSearchApi from "../TorrentSearchApi.mjs";
import { setCurrentSearchResults, setMediaType } from "../state.mjs";

const router = express.Router();

router.get("/search", async (req, res) => {
  const title = req.query.title;
  const media = req.query.media;
  const limit = req.query.limit;

  console.log(`Received ${media}: '${title}' | Limit: ${limit}`);

  let searchResults;
  if(limit == -1){
    searchResults = await TorrentSearchApi.search(title, media);
  } else {
    searchResults = await TorrentSearchApi.search(title, media, limit);
  }

  setCurrentSearchResults(searchResults);
  setMediaType(media);
  res.json(searchResults);
});

export default router;
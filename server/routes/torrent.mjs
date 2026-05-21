import express from "express";
import fs from 'fs';
import path from 'path';

import { getIO, getSocket } from "../socket.mjs";
import torrentClient from "../TorrentClient.mjs";
import TorrentSearchApi from "../TorrentSearchApi.mjs";
import { currentSearchResults, mediaType } from "../state.mjs";
import config from '../../config.paths.json' with { type: 'json' };

const router = express.Router();
const byteToGbMbKb = (bytes) => {
  let GB = bytes / 1073741824;
  if (GB >= 1)
    return `${GB.toFixed(2)} GB`;
  GB *= 1024;
  if (GB >= 0.1)
    return `${GB.toFixed(2)} MB`;
  GB *= 1024;
  return `${GB.toFixed(2)} KB`;
}

/*
  The torrent object TorrentSearchApi wants consists of
  { title, link, seeds, peers, time, size, desc, provider }
  - link is url to .torrent file

  For TorrentClient.add(torrentId, ...), torrentId can take
  - magnet uri (string) => await TorrentSearch.getMagnet(...)
  - http(s) url to a torrent file (string) => pass link
*/
router.post("/confirm", async (req, res) => {
  const link = req.body.link;
  if (!link) return res.status(404).json({ error: "Non-valid http(s) link sent" });

  const io = getIO();

  torrentClient.add(link, {
    path: config[mediaType],
  }, (torrent) => { // This function calls when THIS torrent's ready to be used (metadata available)
    torrent.pause();

    torrent.files.forEach(file => file.deselect());
    console.log("selections before:", JSON.stringify(torrent._selections));

    io.emit("fileList", {
      infoHash: torrent.infoHash,
      files: torrent.files.map((file, index) => ({
        index: index,
        path: file.path,
        name: file.name,
        size: byteToGbMbKb(file.size)
      }))
    });

    getSocket().on("fileSelection", ({ infoHash, selectedIndices }) => {
      if (infoHash !== torrent.infoHash) return;
      selectedIndices.forEach(index => torrent.files[index].select());
      console.log("selections after:", JSON.stringify(torrent._selections));
      torrent.resume();
    });

    torrent.on("download", () => {
      const progress = (torrent.progress * 100).toFixed(2);
      const speed = byteToGbMbKb(torrent.downloadSpeed);

      io.emit("progress", {
        infoHash: torrent.infoHash,
        progress: progress,
        speed: speed
      });

      process.stdout.write(`\rProgress: ${progress}% | Speed: ${speed}/s     `);
    });

    torrent.on("warning", err => {
      const ignored = [
        "tracker request timed out",
        "ENOTFOUND",
        "No nodes to query"
      ];
      if (ignored.some(msg => err.message.includes(msg))) return;
      console.log("TORRENT WARNING:", err.message);
    });

    torrent.on("error", err => {
      console.log("TORRENT ERROR:", err.message);
    });

    torrent.on("noPeers", trackerType => {
      console.log("NO PEERS FROM:", trackerType);
    });
  }
  );
});

router.post("/cancel", async (req, res) => {
  console.log("\nCANCEL!!");

  const torrent = await torrentClient.get(req.body.infoHash);

  if (!torrent) {
    return res.status(404).json({ error: "Could not find torrent to cancel" });
  }

  const torrentPath = torrent.path;
  const torrentFolder = path.join(torrentPath, torrent.name);
  const torrentFiles = torrent.files.map(f => path.join(torrentPath, f.path));

  torrent.destroy({}, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Torrent Exists, Failed to Cancel " });
    }

    for (const filePath of torrentFiles) {
      fs.rm(filePath, { recursive: true, force: true }, (fsErr) => {
        if (fsErr) console.log("Failed to delete file: ", fsErr.message);
      });
    }

    fs.rm(torrentFolder, { recursive: true, force: true }, (fsErr) => {
      if (fsErr) console.log("Failed to delete folder: ", fsErr.message);
    });

    res.json({ response: "destroyed" });
  })
});

export default router;
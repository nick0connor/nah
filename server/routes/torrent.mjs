import express from "express";
import fs from 'fs';
import path from 'path';

import { getIO } from "../socket.mjs";
import torrentClient from "../TorrentClient.mjs";
import TorrentSearchApi from "../TorrentSearchApi.mjs";
import { mostRecentTorrent, mediaType } from "../state.mjs";
import config from '../../config.paths.json' with { type: 'json' };

const router = express.Router();

function addTorrentAsync(torrentClient, magnet) {
  const io = getIO();

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

router.post("/confirm", async (req, res) => {
  if (!mostRecentTorrent || mostRecentTorrent.length === 0) {
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
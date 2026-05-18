import express from "express";
import fs from 'fs';
import { fileURLToPath } from "node:url";

const router = express.Router();
const configPath = fileURLToPath(new URL('../../config.paths.json', import.meta.url));

router.get('/paths', (req, res) => {
  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read paths" });
  }
});

router.post('/paths', (req, res) => {
  const { Movies, TV } = req.body;

  try {
    const updated = { Movies, TV };
    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
    res.json({ response: "saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save paths" });
  }
});

export default router;
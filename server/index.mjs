import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

app.post("/search", (req, res) => {
  const query = req.body.query;

  console.log("Received query", query);

  // Processing

  res.json({ status: "received", query });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
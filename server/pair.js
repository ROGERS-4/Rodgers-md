const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/generate", (req, res) => {
  const { number } = req.body;
  if(!number) return res.status(400).json({ error: "Number required" });

  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  // Here you would save the code linked with number for pairing
  res.json({ pairCode: code, channel: "https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x" });
});

module.exports = router;

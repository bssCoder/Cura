const express = require("express");
const axios = require("axios");
const Chat = require("../models/Chat.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();

const router = express.Router();

// Middleware for authentication
function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET all chats of a user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// DELETE a chat by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    await Chat.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// POST to update chat with a new message
router.post("/update", auth, async (req, res) => {
  const { query, last_user_query, last_bot_answer } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Call local AI service
    const botRes = await axios.post("http://localhost:7001/detect", {
      query,
      last_user_query,
      last_bot_answer,
    });

    const response = botRes.data?.response;

    // Save the chat
    const chat = new Chat({
      user: req.user.id,
      messages: [
        { role: "user", query },
        { role: "bot", query: response },
      ],
    });

    await chat.save();

    // Associate chat with user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { chats: chat._id } },
      { new: true }
    );

    res.json({ message: "Chat saved", chat, user });
  } catch (err) {
    console.error("Error in /update:", err.message);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

module.exports = router;

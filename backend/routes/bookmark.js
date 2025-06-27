const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");

// Get user's bookmarks
router.get("/:userId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId })
      .populate("contestId")
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bookmark
router.post("/", async (req, res) => {
  try {
    const { userId, contestId } = req.body;
    const bookmark = new Bookmark({ userId, contestId });
    const savedBookmark = await bookmark.save();
    await savedBookmark.populate("contestId");
    res.status(201).json(savedBookmark);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Contest already bookmarked" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete bookmark
router.delete("/:userId/:contestId", async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      userId: req.params.userId,
      contestId: req.params.contestId,
    });
    if (!result) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
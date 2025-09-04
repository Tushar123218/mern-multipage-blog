const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("history.blogId", "title")
      .populate("history.pageId", "title")
      .populate("history.commentId", "content");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user history timeline
router.get("/:id/history", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("history")
      .populate("history.blogId", "title")
      .populate("history.pageId", "title")
      .populate("history.commentId", "content");

    res.json(user.history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to user history (helper route)
router.post("/:id/history", async (req, res) => {
  try {
    const { action, blogId, pageId, commentId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          history: { action, blogId, pageId, commentId }
        }
      },
      { new: true }
    )
      .populate("history.blogId", "title")
      .populate("history.pageId", "title")
      .populate("history.commentId", "content");

    res.json(user.history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

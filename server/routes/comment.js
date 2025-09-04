// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// Get comments for a blog (with replies)
router.get("/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate("user", "username email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post comment (or reply if parent is set)
router.post("/", async (req, res) => {
  try {
    const { blogId, userId, text, parent } = req.body;

    const comment = new Comment({ blog: blogId, user: userId, text, parent });
    await comment.save();

    // attach to blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id }
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const User = require("../models/User");


// ✅ Create blog with embedded pages
router.post("/", async (req, res) => {
  try {
    const { title, description, author, pages } = req.body;

    const blog = new Blog({ title, description, author, pages });
    await blog.save();

    await User.findByIdAndUpdate(author, {
      $push: { history: { action: "created_blog", blogId: blog._id } }
    });

    res.status(201).json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like blog
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      $push: { history: { action: "liked_blog", blogId: blog._id } }
    });

    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username email" }
      })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username email" }
      });

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a blog (only author can update)
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.body.author || req.body.userId || req.query.userId;
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (
      !blog.author ||
      (
        (typeof blog.author === "object" && blog.author._id
          ? blog.author._id.toString()
          : blog.author.toString()
        ) !== userId
      )
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }
    // Now update the blog
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.pages = req.body.pages;
    await blog.save();
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// blogRoutes.js
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.query.userId || req.body.userId; // or req.user.id if using auth middleware
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔍 Search blogs by title, description, or author username
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;

    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "users",           // collection name of users
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { "authorInfo.username": { $regex: query, $options: "i" } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;

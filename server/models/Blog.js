const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true }
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pages: [pageSchema], // 👈 embedded pages
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

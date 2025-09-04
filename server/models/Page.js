const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  content: { type: String, required: true }, // You can use a rich text editor on frontend
  order: { type: Number } // to arrange multiple pages
}, { timestamps: true });

module.exports = mongoose.model("Page", pageSchema);

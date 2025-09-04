const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePic: { type: String },

  // Detailed history tracking
  history: [
    {
      action: { type: String, required: true }, // "created", "liked", "commented", "shared"
      blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
      pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
      commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

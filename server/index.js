const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Request logger (debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`, req.body || {});
  next();
});

// Routes
const userRoutes = require("./routes/user");   // instead of authRoutes
const blogRoutes = require("./routes/blogRoutes");
const pageRoutes = require("./routes/page");
const commentRoutes = require("./routes/comment");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/comments", commentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

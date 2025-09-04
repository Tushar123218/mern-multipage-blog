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
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogRoutes");
const pageRoutes = require("./routes/page");
const commentRoutes = require("./routes/comment");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/comments", commentRoutes);

// MongoDB connection with proper handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, 
  );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit if DB connection fails
  }
};

connectDB();

// Optional: log connection events
mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.error("Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

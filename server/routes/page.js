const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const User = require("../models/User");

// Create page
router.post("/", async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();

    // Add to user history
    await User.findByIdAndUpdate(page.owner, {
      $push: {
        history: { action: "created_page", pageId: page._id }
      }
    });

    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

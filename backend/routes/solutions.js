const express = require("express");
const router = express.Router();
const Contest = require("../models/Contest");

// Add solution URL
router.post("/", async (req, res) => {
  try {
    const { contestId, solutionUrl } = req.body;
    const contest = await Contest.findByIdAndUpdate(
      contestId,
      { solutionUrl },
      { new: true }
    );
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
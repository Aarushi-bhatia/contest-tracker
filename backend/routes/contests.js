const express = require("express");
const router = express.Router();
const Contest = require("../models/Contest")

router.get("/", async(req, res)=>{
  try {
    const {platform} = req.query;
    let query = {};

    if(platform){
      query.platform = {$in: platform.split(",")}
    }

    const contests = await Contest.find(query).sort({ startTime: 1})
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
})

router.get("/:id", async(req, res)=>{
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.patch("/:id/solution", async(req, res)=>{
  try {
    const {solutionUrl} = req.body;
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      { solutionUrl},
      { new: true}
    )
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
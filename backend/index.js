const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const contestRoutes = require("./routes/contests");
const bookmarkRoutes = require("./routes/bookmark");
const solutionRoutes = require("./routes/solutions");
const ContestService = require("./services/ContestService");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/solutions", solutionRoutes);

// Fetch contests every hour
cron.schedule("*/1 * * * *", async () => { // Runs every 1 minute for quick debugging
  console.log("⏰ Cron job is running...");
  try {
    
    const codeforcesContests = await ContestService.fetchCodeforcesContests();
    console.log("📌 Codeforces Contests:", codeforcesContests);

    const leetcodeContests = await ContestService.fetchLeetcodeContests();
    console.log("📌 LeetCode Contests:", leetcodeContests);

    const codechefContests = await ContestService.fetchCodeChefContests();
    console.log("📌 CodeChef Contests:", codechefContests);

    const allContests = [...codeforcesContests, ...leetcodeContests, ...codechefContests];

    console.log("📌 Total Contests Fetched:", allContests.length);

    await ContestService.saveContests(allContests);
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
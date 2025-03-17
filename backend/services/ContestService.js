const axios = require("axios");
const Contest = require("../models/Contest");

class ContestService {
  async fetchCodeforcesContests() {
    try {
      console.log("Fetching Codeforces contests...");
      const response = await axios.get(
        "https://codeforces.com/api/contest.list"
      );
      const contests = response.data.result.map((contest) => ({
        name: contest.name,
        platform: "Codeforces",
        startTime: new Date(contest.startTimeSeconds * 1000),
        endTime: new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        ),
        url: `https://codeforces.com/contest/${contest.id}`,
      }));
      console.log(`✅ Found ${contests.length} Codeforces contests`);
      return contests;
    } catch (error) {
      console.error("❌ Error fetching Codeforces contests:", error.message);
      return [];
    }
  }

  async fetchLeetcodeContests() {
    try {
      console.log("Fetching LeetCode contests...");
      const query = `
        query {
          allContests {
            title
            startTime
            duration
            titleSlug
          }
        }`;

      const response = await axios.post("https://leetcode.com/graphql", {
        query,
      });
      const contests = response.data.data.allContests.map((contest) => ({
        name: contest.title,
        platform: "LeetCode",
        startTime: new Date(contest.startTime * 1000),
        endTime: new Date((contest.startTime + contest.duration) * 1000),
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));
      console.log(`✅ Found ${contests.length} LeetCode contests`);
      return contests;
    } catch (error) {
      console.error("❌ Error fetching LeetCode contests:", error.message);
      return [];
    }
  }

  async fetchCodeChefContests() {
    try {
      const response = await axios.get(
        "https://www.codechef.com/api/list/contests/all"
      );

      if (!response.data.future_contests) {
        throw new Error("Failed to fetch CodeChef contests");
      }

      const contests = response.data.future_contests.map((contest) => ({
        platform: "CodeChef",
        name: contest.contest_name,
        code: contest.contest_code,
        startTimeUnix: Math.floor(
          new Date(contest.contest_start_date).getTime() / 1000
        ),
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: calculateDuration(
          contest.contest_start_date,
          contest.contest_end_date
        ),
        url: `https://www.codechef.com/${contest.contest_code}`,
      }));

      console.log(`📌 Found ${contests.length} CodeChef contests`, contests);
      return contests;
    } catch (error) {
      console.error("❌ Error fetching CodeChef contests:", error.message);
      return [];
    }
  }

  async saveContests(contests) {
    try {
      if (!contests || contests.length === 0)
        return console.log("❌ No contests to save.");

      for (const contest of contests) {
        await Contest.updateOne(
          { name: contest.name, platform: contest.platform },
          { $set: contest },
          { upsert: true } // Ensures new contests are added
        );
      }
      console.log(`✅ Saved ${contests.length} contests.`);
    } catch (error) {
      console.error("❌ Error saving contests:", error.message);
    }
  }
}

// ✅ Correctly exporting the instance
module.exports = new ContestService();

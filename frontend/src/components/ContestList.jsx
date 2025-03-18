import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";

const ContestList = ({ contests, onBookmark }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "Codeforces",
    "CodeChef",
    "LeetCode",
  ]);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredContests = contests
    .filter((contest) => selectedPlatforms.includes(contest.platform))
    .filter((contest) => new Date(contest.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "Codeforces":
        return "bg-[#1E88E5]";
      case "CodeChef":
        return "bg-[#5D4037]";
      case "LeetCode":
        return "bg-[#FFA000]";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };


  const getTimeStatus = (startTime) => {
    const now = new Date();
    const contestTime = new Date(startTime);
    const diff = contestTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return {
        text: "Starting soon!",
        color: "text-red-500 dark:text-red-400 font-semibold"
      };
    } else if (hours < 24) {
      return {
        text: `Starting in ${hours} hour${hours > 1 ? 's' : ''}`,
        color: "text-orange-500 dark:text-orange-400"
      };
    } else {
      return {
        text: `Starts ${formatDistanceToNow(contestTime)} from now`,
        color: "text-gray-600 dark:text-gray-300"
      };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Upcoming Coding Contests
      </h1>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {["Codeforces", "LeetCode", "CodeChef"].map((platform) => (
          <button
            key={platform}
            className={`px-6 py-2 rounded-full transition-all duration-200 text-white font-medium shadow-md ${getPlatformColor(
              platform
            )} ${!selectedPlatforms.includes(platform) ? "opacity-40" : "hover:shadow-lg transform hover:-translate-y-1"}`}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredContests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-xl">
            No upcoming contests found for the selected platforms
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredContests.map((contest) => {
            const timeStatus = getTimeStatus(contest.startTime);
            
            return (
              <motion.div
                key={contest._id}
                className={`bg-white dark:bg-[#050819] border border-muted border-[#384c6c]/60 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300)}`}
                variants={item}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {contest.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs text-white mt-2 ${getPlatformColor(
                        contest.platform
                      )}`}
                    >
                      {contest.platform}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-300">
                      {new Date(contest.startTime).toLocaleString()}
                    </p>
                    <p className={timeStatus.color}>
                      {timeStatus.text}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#1787ec] text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors text-center font-medium shadow-sm hover:shadow-md"
                    >
                      Go to Contest
                    </a>
                    <button
                      onClick={() => onBookmark(contest._id)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Bookmark contest"
                    >
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </button>
                  </div>
                  {contest.solutionUrl && (
                    <a
                      href={contest.solutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Solution
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default ContestList;
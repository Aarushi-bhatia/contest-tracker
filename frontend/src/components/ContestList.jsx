import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "./ThemeContext";

const ContestList = ({ contests, onBookmark }) => {
  
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "Codeforces",
    "CodeChef",
    "LeetCode",
  ]);
  const { theme } = useTheme();

 

  const filteredContests = contests
  .filter((contest) => selectedPlatforms.includes(contest.platform)) // Platform filter
  .filter((contest) => new Date(contest.startTime) >= new Date()) // Exclude past contests
  .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort by closest upcoming

  
  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p != platform)
        : [...prev, platform]
    );
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "Codeforces":
        return "bg-red-500 hover:bg-red-600";
      case "CodeChef":
        return "bg-green-500 hover:bg-green-600";
      case "LeetCode":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4  py-8">
      <div className="flex flex-wrap gap-4 mb-8">
        {["Codeforces", "LeetCode", "CodeChef"].map((platform) => (
          <button
            key={platform}
            className={`px-4 py-2 rounded-full transition-all duration-200 text-white ${getPlatformColor(
              platform
            )} ${!selectedPlatforms.includes(platform) && "opacity-50"}`}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
          <div
            key={contest._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {contest.name}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-2 ${getPlatformColor(
                    contest.platform
                  )}`}
                >
                  {contest.platform}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
                <p>
                  {new Date(contest.startTime) > new Date()
                    ? `Starts ${formatDistanceToNow(
                        new Date(contest.startTime)
                      )} from now`
                    : `Started ${formatDistanceToNow(
                        new Date(contest.startTime)
                      )} ago`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={contest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-center"
                >
                  Go to Contest
                </a>
                <button
                  onClick={() => onBookmark(contest._id)}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;

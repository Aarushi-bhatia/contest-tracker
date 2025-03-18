import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';

const BookmarkedContests = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 'Aarushi-bhatia'; // Using your GitHub login as userId

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await api.getBookmarks(userId);
      setBookmarks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (contestId) => {
    try {
      await api.removeBookmark(userId, contestId);
      setBookmarks(prevBookmarks =>
        prevBookmarks.filter(bookmark => bookmark.contestId?._id !== contestId)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Bookmarked Contests
      </h2>
      
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No bookmarked contests yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.filter(({ contestId }) => contestId).map(({ contestId: contest }) => (
            <div
              key={contest._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contest.name}
                  </h3>
                  <span className="inline-block px-2 py-1 rounded-full text-xs text-white mt-2 bg-primary-600">
                    {contest.platform}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
                  <p>
                    {new Date(contest.startTime) > new Date()
                      ? `Starts ${formatDistanceToNow(new Date(contest.startTime))} from now`
                      : `Started ${formatDistanceToNow(new Date(contest.startTime))} ago`}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-center"
                  >
                    Go to Contest
                  </a>
                  <button
                    onClick={() => removeBookmark(contest._id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedContests;
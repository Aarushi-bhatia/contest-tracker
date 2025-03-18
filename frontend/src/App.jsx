import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import ContestList from "./components/ContestList";
import BookmarkedContests from "./components/BookmarkedContests";
import SolutionForm from "./components/SolutionForm";
import Navbar from "./components/Navbar";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { Toaster, toast } from "react-hot-toast";
import { api } from "./services/api";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [contests, setContests] = useState([]);
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "Aarushi-bhatia";
  const { theme } = useTheme(); // Now useTheme() is within ThemeProvider

  useEffect(() => {
    fetchContests();
    fetchUserBookmarks();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await api.getContests();
      setContests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    try {
      const bookmarks = await api.getBookmarks(userId);
      const bookmarkedIds = new Set(bookmarks.map((b) => b.contestId._id));
      setBookmarkedContests(bookmarkedIds);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleBookmark = async (contestId) => {
    const toastId = toast.loading(
      bookmarkedContests.has(contestId) ? "Removing bookmark..." : "Adding bookmark..."
    );
    try {
      if (bookmarkedContests.has(contestId)) {
        await api.removeBookmark(userId, contestId);
        setBookmarkedContests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(contestId);
          return newSet;
        });
        toast.success("Bookmark removed successfully", { id: toastId });
      } else {
        await api.addBookmark(userId, contestId);
        setBookmarkedContests((prev) => new Set([...prev, contestId]));
        toast.success("Contest bookmarked successfully", { id: toastId });
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
      toast.error(error.message || "Failed to manage bookmark", { id: toastId });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-xl font-medium">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#1C2331] transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Loading contests...
                </div>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<ContestList contests={contests} onBookmark={handleBookmark} />} />
              <Route path="/bookmarks" element={<BookmarkedContests contests={contests.filter(c => bookmarkedContests.has(c._id))} onBookmark={handleBookmark} />} />
              <Route path="/add-solution" element={<SolutionForm />} />
            </Routes>
          )}
        </main>
      </div>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  );
}

export default App;

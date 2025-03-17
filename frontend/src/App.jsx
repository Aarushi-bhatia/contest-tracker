import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContestList from "./components/ContestList";
import BookmarkedContests from "./components/BookmarkedContests";
import SolutionForm from "./components/SolutionForm";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeContext";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { api } from "./services/api";

function App() {
  const [contests, setContests] = useState([]);
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "Aarushi-bhatia";

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
      bookmarkedContests.has(contestId)
        ? "Removing bookmark..."
        : "Adding bookmark..."
    );
    try {
      if (bookmarkedContests.has(contestId)) {
        // Remove bookmark
        await api.removeBookmark(userId, contestId);
        setBookmarkedContests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(contestId);
          return newSet;
        });
        toast.success("Bookmark removed successfully", { id: toastId });
      } else {
        // Add bookmark
        await api.addBookmark(userId, contestId);
        setBookmarkedContests((prev) => new Set([...prev, contestId]));
        toast.success("Contest bookmarked successfully", { id: toastId });
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
      toast.error(error.message || "Failed to manage bookmark", {
        id: toastId,
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={<ContestList contests={contests} />}
                  />
                  <Route path="/bookmarks" element={<BookmarkedContests />} />
                  <Route path="/add-solution" element={<SolutionForm />} />
                </Routes>
              )}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                duration: 2000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 3000,
                theme: {
                  primary: "#ff4b4b",
                },
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

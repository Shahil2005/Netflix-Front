import axios from "axios";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        console.log("Fetching search history...");
        const res = await axios.get(`/api/v1/search/history`);

        if (res.data && res.data.content) {
          console.log("Search History Data:", res.data.content);
          setSearchHistory(res.data.content);
        } else {
          console.warn("No search history found in response.");
          setSearchHistory([]);
        }
      } catch (error) {
        console.error("Error fetching search history:", error.message);
        setSearchHistory([]);
      } finally {
        setLoading(false);
      }
    };

    getSearchHistory();
  }, []);

  const handleDelete = async (entryId) => {
    setDeletingId(entryId); // Show loading indicator for this item
    try {
      await axios.delete(`/api/v1/search/history/${entryId}`);
      setSearchHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== entryId)
      );
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete search item:", error);
      toast.error("Failed to delete search item");
    } finally {
      setDeletingId(null); // Reset deleting state
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-xl">Loading search history...</p>
      </div>
    );
  }

  if (searchHistory.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl text-gray-400">No Search History Found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Search History</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchHistory.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 p-4 rounded flex items-start"
            >
              <img
                src={SMALL_IMG_BASE_URL + entry.image}
                alt={entry.title || "History Image"}
                className="size-16 rounded-full object-cover mr-4"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="flex flex-col">
                <span className="text-white text-lg">
                  {entry.title || "Untitled"}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              <span
                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto ${
                  entry.searchType === "movie"
                    ? "bg-red-600"
                    : entry.searchType === "Tv shows"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
              >
                {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
              </span>

              <Trash
                className={`size-5 ml-4 cursor-pointer ${
                  deletingId === entry.id
                    ? "animate-pulse text-gray-500"
                    : "hover:text-red-600"
                }`}
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id} // Disable while deleting
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;

import React, { useState } from "react";
import { useContentStore } from "../../store/content";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";  // ✅ Fixed import
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";

const SearchPages = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { setContentType } = useContentStore();

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setContentType(tab);
    setResults([]); // ✅ Clears old results when switching tabs
  };

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return toast.error("Enter a search term!");
    
    try {
      console.log(`Searching for: ${searchTerm} in ${activeTab}`);
      const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
      
      console.log("API Response:", res.data);
      setResults(res.data.content || []);
      
      if (!res.data.content || res.data.content.length === 0) {
        toast.error("No results found in this category!");
      }
    } catch (error) {
      console.error("Search error:", error);
      if (error.response?.status === 404) {
        toast.error("Nothing found, check the search category.");
      } else {
        toast.error("An error occurred, please try again.");
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-4">
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded ${
                activeTab === tab ? "bg-red-600" : "bg-gray-800"
              } hover:bg-red-700`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form
          className="flex gap-2 items-stretch mb-4 max-w-2xl mx-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for ${activeTab}...`}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>

        {/* Search Results */}
        {results.length === 0 ? (
          <p className="text-center text-gray-400">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((result) => {
              const imagePath = result.poster_path || result.profile_path;
              if (!imagePath) return null; // ✅ Skip items without images

              console.log("Rendering item:", result);

              return (
                <div key={result.id} className="bg-gray-800 p-4 rounded">
                  {activeTab === "person" ? (
                    <Link
                      to={`/actor/${encodeURIComponent(result.name)}`} // ✅ Fixed Person URL
                      className="flex flex-col items-center"
                    >
                      <img
                        src={ORIGINAL_IMG_BASE_URL + imagePath}
                        alt={result.name}
                        className="max-h-96 rounded mx-auto"
                      />
                      <h2 className="mt-2 text-xl font-bold">{result.name}</h2>
                    </Link>
                  ) : (
                    <Link to={`/watch/${result.id}`}>
                      <img
                        src={ORIGINAL_IMG_BASE_URL + imagePath}
                        alt={result.title || result.name}
                        className="w-full h-auto rounded"
                      />
                      <h2 className="mt-2 text-xl font-bold">
                        {result.title || result.name}
                      </h2>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPages;

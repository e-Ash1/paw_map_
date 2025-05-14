import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecentSearches = ({ searches = [], onRefetch, onDelete, onRevisit }) => {
  // Open Toggle
  const [isOpen, setIsOpen] = useState(false);
  // Displays the last 4 recent searches
  const displayedSearches = Array.isArray(searches) ? searches.slice(0, 4) : [];

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      {/* Header Toggle */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-grow flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-semibold transition-all duration-300"
        >
          Recent Searches
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ⌄
          </motion.span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefetch}
          className="ml-2 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-100 transition-all flex items-center gap-1"
        >
          <motion.span
            whileTap={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            🔄
          </motion.span>
          Refresh
        </button>
      </div>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            {displayedSearches.length > 0 ? (
              <ul className="space-y-3">
                {displayedSearches.map((search, index) => (
                  <motion.li
                    key={search.id || index}
                    onClick={() =>
                      onRevisit(
                        search.location?.string?.from || "Unknown Origin",
                        search.location?.string?.to || "Unknown Destination"
                      )
                    }
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer transition-all duration-300 relative"
                  >
                    <strong className="block capitalize">
                      {search.searchType}
                    </strong>
                    <p className="text-gray-600 text-sm">
                      From: {search.location?.string?.from || "Unknown"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      To: {search.location?.string?.to || "Unknown"}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(search.id);
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition transform hover:scale-110"
                      title="Delete this search"
                    >
                      ✕
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm mt-2">No recent searches.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentSearches;

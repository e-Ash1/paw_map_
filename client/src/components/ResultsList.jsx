import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResultsList = ({
  markers = [],
  loading = false,
  lastSearch,
  onGetDirections,
  onResultHover,
  hoveredIndex,
  activeResultIndex,
  setActiveResultIndex,
  onResultSelect,      
  directionsParsed,
  onStepHover,
  activeStepIndex,
  onStepClick,
  clearParsedDirections,
}) => {
  // Only shows the places that have ratings
  const ratedMarkers = markers.filter((place) => place.rating != null);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full h-full p-6 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden relative">
        <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">Search Results</h3>
        <div className="space-y-4 flex-grow p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gray-200 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-3/5 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Extract leg info
  const leg = directionsParsed?.legs?.[0];
  const originAddress = leg?.startAddress || lastSearch || "Origin";
  const destinationAddress = leg?.endAddress || "Destination";
  const eta = leg?.duration || "";
  const distance = leg?.distance || "";

  return (
    <div className="relative w-full h-full p-6 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">Search Results</h3>
      <ul className="flex-grow overflow-y-auto space-y-3">
        {ratedMarkers.length > 0 ? (
          ratedMarkers.map((place, idx) => (
            <motion.li
              key={place.place_id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              onClick={() => onResultSelect(place, idx)} 
              onMouseEnter={() => onResultHover(idx)}
              onMouseLeave={() => onResultHover(null)}
              className={`p-3 border rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center ${
                hoveredIndex === idx || activeResultIndex === idx
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div>
                <strong>{idx + 1}. {place.name}</strong>
                <p className="text-sm text-yellow-600 mt-1">
                  <strong>Rating:</strong> {place.rating} ⭐
                </p>
                <p className="text-sm text-gray-600 mt-1 truncate">{place.vicinity}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onGetDirections(lastSearch, place.vicinity); }}
                className="text-green-500 hover:text-green-700 text-xl"
              >
                📍
              </button>
            </motion.li>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No rated search results found.</p>
        )}
      </ul>

      {/* Slide-up directions panel */}
      <AnimatePresence>
        {directionsParsed && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-y-auto z-30"
          >
            <div className="p-6 border-b bg-gray-50 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-700">Directions</h4>
                <p className="text-sm text-gray-600">From: <span className="font-medium">{originAddress}</span></p>
                <p className="text-sm text-gray-600">To: <span className="font-medium">{destinationAddress}</span></p>
                {distance && eta && (
                  <p className="text-sm text-gray-600">Distance: <span className="font-medium">{distance}</span>, ETA: <span className="font-medium">{eta}</span></p>
                )}
              </div>
              <button
                onClick={clearParsedDirections}
                className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                title="Close"
              >
                ✕
              </button>
            </div>
            <ol className="p-6 space-y-2">
              {leg?.steps?.map((instr, idx) => (
                <li
                  key={idx}
                  onClick={() => onStepClick(idx)}
                  onMouseEnter={() => onStepHover(idx)}
                  className={`cursor-pointer text-sm leading-relaxed ${
                    activeStepIndex === idx
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-700 hover:text-green-500'
                  }`}
                >
                  <span className="font-medium mr-1">{idx + 1}.</span>{instr}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsList;

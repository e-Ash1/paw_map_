import { useEffect, useState } from "react";

const useUserLocation = (setCenterCallback) => {
  const [lastSearch, setLastSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("lastSearch");
    if (saved) {
      if (!isNaN(saved.split(",")[0])) {
        const [lat, lng] = saved.split(",").map(Number);
        const coords = { lat, lng };
        setCenterCallback(coords);
        setLastSearch(`${coords.lat},${coords.lng}`);
      } else {
        setLastSearch(saved);
      }
    }
  }, [setCenterCallback]);

  return { lastSearch, setLastSearch, recentSearches, setRecentSearches };
};

export default useUserLocation;

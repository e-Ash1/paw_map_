import { useState, useEffect } from "react";

const useMap = (fetchPlaces, setLastSearch, setRecentSearches) => {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // NYC default
  const [mapSize, setMapSize] = useState({ width: "100%", height: "100%" });
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const updateSize = () => setMapSize({ width: "100%", height: "100%" });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handlePlaceChanged = (searchBox, fetchPlaces, setLastSearch) => {
    if (!searchBox) return;
    const place = searchBox.getPlace();
    if (!place.geometry || !place.geometry.location) return;
  
    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
  
    console.log("📍 Recenter to:", newCenter);
    setCenter(newCenter);
    localStorage.setItem("lastSearch", place.formatted_address);
    if (setLastSearch) setLastSearch(place.formatted_address);
    if (fetchPlaces) fetchPlaces(newCenter);
  };
  
  return {
    map,
    setMap,
    searchBox,
    setSearchBox,
    center,
    setCenter,
    mapSize,
    handlePlaceChanged,
    selectedPlace, 
    setSelectedPlace
  };
};

export default useMap;

import { useState } from "react";
import { deleteRecentSearchById, fetchRecentSearches } from "../utils/searchHandler";

const useSearch = (
  setMarkers,
  setAllMarkers,
  type,
  setLastSearch,
  setRecentSearches,
  setCenter
) => {
  // Adds a loading state for skeletons
  const [loading, setLoading] = useState(false);

  // Fetches a list of nearby places
  const fetchPlaces = async (location) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/places?location=${location.lat},${location.lng}&type=${type}&radius=5000`
      );
      const data = await res.json();

      setMarkers(data.results || []);
      setAllMarkers(data.results || []);
      setRecentSearches(await fetchRecentSearches());
    } catch (error) {
      console.error("❌ Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetches the same search (e.g. from RecentSearches)
  const handleRefetchSearch = async (unusedType, location) => {
    setLoading(true);
    try {
      await fetchPlaces({ lat: location.coords.lat, lng: location.coords.lng });
    } catch (error) {
      console.error("❌ Error refetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  // Google-Places Autocomplete “place-changed” handler
  const handlePlaceChanged = (searchBox) => {
    if (!searchBox) return;
    const place = searchBox.getPlace();
    if (!place?.geometry?.location) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setCenter(location);
    setLastSearch(place.formatted_address);
    localStorage.setItem("lastSearch", place.formatted_address);

    fetchPlaces(location);
  };

  // Deletes a recent search and refresh the list
  const deleteRecentSearch = async (id) => {
    try {
      await deleteRecentSearchById(id);
      const updated = await fetchRecentSearches();
      setRecentSearches(updated);
    } catch (err) {
      console.error("❌ Error deleting recent search:", err);
    }
  };

  // Refreshes the “Recent Searches” list
  const refreshRecentSearches = async () => {
    try {
      const updated = await fetchRecentSearches();
      setRecentSearches(updated);
    } catch (err) {
      console.error("❌ Failed to refresh recent searches:", err);
    }
  };

  return {
    fetchPlaces,
    handleRefetchSearch,
    handlePlaceChanged,
    deleteRecentSearch,
    refreshRecentSearches,
    loading,
  };
};

export default useSearch;
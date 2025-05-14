import axios from "axios";
import { getUserId } from "./userSession.js";

/**
 * Converts 'veterinary_care' → 'Veterinary Care'
 */
export const formatSearchType = (type) => {
  if (!type) return "Unknown Type";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const sanitizeString = (input, fallback = "Unknown") => {
  if (!input || typeof input !== "string" || input.trim() === "") return fallback;
  return input.trim();
};

export const deleteRecentSearchById = async (id) => {
  try {
    await axios.delete(`/api/queries/delete/${id}`);
  } catch (err) {
    console.error("Error deleting recent search:", err);
  }
};

export const saveSearchQuery = async (
  searchType,
  searchResults,
  location,
  searchURL,
  originString,
  destinationString
) => {
  try {
    const userId = getUserId();
    console.log(`🛠 User ID: ${userId}`);
    if (!userId) {
      console.error("❌ No User ID found in localStorage.");
      return;
    }

    const formattedType = formatSearchType(searchType);
    const payload = {
      userId,
      searchType: formattedType,
      searchURL: searchURL || `${window.location.href}`,
      location: {
        origin: location?.origin || {},
        destination: location?.destination || {},
        string: {
          from: sanitizeString(originString),
          to: sanitizeString(destinationString),
        },
      },
    };

    console.log("🛠 Sending Payload →", payload);
    await axios.post("/api/queries/save", payload);
  } catch (error) {
    console.error("❌ Error saving search query:", error);
  }
};

export const fetchRecentSearches = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get("/api/queries/recent", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    return [];
  }
};

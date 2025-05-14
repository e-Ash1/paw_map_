const axios = require("axios");
const { geocodeLocation } = require("../services/geocodingService");
require("dotenv").config();

exports.geocodeLocation = geocodeLocation;

exports.getGoogleDirections = async (originCoords, destinationCoords) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
      params: {
        origin: `${originCoords.lat},${originCoords.lng}`,
        destination: `${destinationCoords.lat},${destinationCoords.lng}`,
        mode: "DRIVING",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error(`Google API Error: ${response.data.status}`);
    }

    return response.data; // ✅ Raw API response
  } catch (err) {
    console.error("❌ Error in getGoogleDirections:", err.message);
    throw err;
  }
};

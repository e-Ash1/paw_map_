const axios = require("axios");

exports.getPlaces = async (lat, lng, type) => {
    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = process.env.GOOGLE_PLACES_URL;

        const response = await axios.get(URL, {
            params: {
                location: `${lat},${lng}`,
                radius: 10000,
                type,
                key: API_KEY
            }
        });

        if (response.data.status !== "OK") {
            throw new Error(`Places API failed: ${response.data.error_message || response.data.status}`);
        }

        return { results: response.data.results, center: { lat, lng } };

    } catch (error) {
        console.error("Error fetching places from Google API:", error.message);
        throw error;
    }

};

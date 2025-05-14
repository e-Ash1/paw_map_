const axios = require("axios");

exports.geocodeLocation = async (query) => {
    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = process.env.GOOGLE_GEOCODE_URL;

        const response = await axios.get(URL, {
            params: {
                address: query,
                key: API_KEY
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            console.error(`No geocode results found for location: ${query}`);
            throw new Error("No results found for the given location.");
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };

    } catch (error) {
        console.error(`Error in Geocode Location Services:`, error.message);
        throw error;
    }

};

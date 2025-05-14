const placesService = require("../services/placesService");
const geocodingService = require("../services/geocodingService");

const placesController = {
  async getPlaces(req, res) {
    try {
      const { lat, lng, type, location } = req.query;

      let finalLat, finalLng;

      if (lat && lng) {
        finalLat = parseFloat(lat);
        finalLng = parseFloat(lng);
      } else if (location) {
        const geocoded = await geocodingService.geocodeLocation(location);
        if (!geocoded) {
          return res.status(404).json({ error: 'No geocoding results for that location.' });
        }

        finalLat = geocoded.lat;
        finalLng = geocoded.lng;
      } else {
        return res.status(400).json({ error: 'Either lat/lng or a location query is required.' });
      }

      const placesData = await placesService.getPlaces(finalLat, finalLng, type);
      return res.status(200).json(placesData);

    } catch (error) {
      console.error('Error in getPlaces controller:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = placesController;

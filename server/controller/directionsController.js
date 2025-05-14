const directionsService = require("../services/directionsService");

const directionsController = {
  async getCoordinates(req, res) {
    try {
      const { origin, destination } = req.query;

      if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required." });
      }

      const originCoords = await directionsService.geocodeLocation(origin);
      const destinationCoords = await directionsService.geocodeLocation(destination);

      if (!originCoords || !destinationCoords) {
        return res.status(400).json({ error: "Could not geocode origin or destination" });
      }

      res.json({ origin: originCoords, destination: destinationCoords });
    } catch (err) {
      console.error("❌ Error getting coordinates:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  },

  async fetchDirections(req, res) {
    try {
      const { origin, destination } = req.query;

      if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required." });
      }

      console.log(`🛠 Fetching directions → Origin: ${origin} | Destination: ${destination}`);

      const originCoords = await directionsService.geocodeLocation(origin);
      const destinationCoords = await directionsService.geocodeLocation(destination);

      const directions = await directionsService.getGoogleDirections(originCoords, destinationCoords);

      res.json(directions);
    } catch (err) {
      console.error("❌ Error fetching directions:", err.message);
      res.status(500).json({ error: "Could not fetch directions" });
    }
  }
};

module.exports = directionsController;

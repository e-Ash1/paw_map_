const express = require("express");
const router = express.Router();
const directionsController = require("../controller/directionsController");

// Geocode endpoint
router.get("/coordinates", directionsController.getCoordinates);

// Main directions fetch endpoint
router.get("/", directionsController.fetchDirections); // ✅ fixed!

module.exports = router;

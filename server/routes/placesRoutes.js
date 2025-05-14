const express = require("express");
const router = express.Router();
const placesController = require("../controller/placesController");

router.get("/", placesController.getPlaces);

module.exports = router;

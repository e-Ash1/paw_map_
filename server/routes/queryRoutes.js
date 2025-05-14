const express = require("express");
const router = express.Router();
const queryController = require("../controller/queryController");

router.post("/save", queryController.saveQuery);
router.get("/recent", queryController.getRecentQueries);
router.delete("/delete/:id", queryController.deleteSearchById);

module.exports = router;

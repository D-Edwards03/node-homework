const express = require("express");

// Import the controller which contains the logic
const timeController = require("../controllers/timeController");

// Handles the routing
const router = express.Router();

// When a GET req hits "/time", the router intercepts and forwards it
// to the getTime function inside the controller
router.get("/time", timeController.getTime);
router.post("/echo", timeController.echoBody);

module.exports = router;
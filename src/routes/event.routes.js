const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { EventController } = require("../controllers/event.controllers");

const router = express.Router();

//get requests
router.get("/", EventController.getAllEvents);
router.get("/:eventId", EventController.getEvent);
router.get("/search", EventController.searchEvents);

//post requests
router.post("/store/:storeId/listEvent", [Auth, access('Seller')], EventController.listEvent);

//put requests
router.put("/:eventId", [Auth, access('Seller','Admin')], EventController.updateEvent);

//delete requests
router.delete("/:eventId", [Auth, access('Seller','Admin')], EventController.deleteEvent);

module.exports.EventRouter = router;
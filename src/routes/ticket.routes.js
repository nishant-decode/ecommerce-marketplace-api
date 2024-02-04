const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { TicketController } = require("../controllers/ticket.controllers");

const router = express.Router();

//get requests
router.get("/:ticketId", TicketController.getTicket);
router.get("/event/:eventId", TicketController.getAllEventTickets);

//post requests
router.post("/event/:eventId/create", [Auth, access('Seller','Admin')], TicketController.createTicket);

//put requests
router.put("/:ticketId", [Auth, access('Seller','Admin')], TicketController.updateTicket);

//delete requests
router.delete("/:ticketId", [Auth, access('Seller','Admin')], TicketController.deleteTicket);

module.exports.TicketRouter = router;
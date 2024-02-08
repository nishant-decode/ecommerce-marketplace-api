const { TicketService } = require("../services/ticket.service");
const { EventService } = require("../services/event.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");
const { StoreService } = require("../services/store.service");

class TicketController {
  //@desc get a Ticket by ticketId
  //@route GET /api/ticket/:ticketId
  //@access public
  getTicket = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { ticketId } = req.params;

    const ticket = await TicketService.findById(ticketId);

    if (!ticket) {
      throw new HttpError(404, "Ticket not found");
    }

    Logger.info(`Ticket by ticketId: ${ticket}`);
    Response(res).status(200).message("Ticket by ticketId").body(ticket).send();
  };

  //@desc get all Tickets by eventId
  //@route GET /api/ticket/event/:eventId
  //@access public
  getAllEventTickets = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { eventId } = req.params;

    const tickets = await TicketService.find({ eventId });

    Logger.info(`Tickets by eventId: ${tickets}`);
    Response(res)
      .status(200)
      .message("Tickets by eventId")
      .body(tickets)
      .send();
  };

  //@desc create a Ticket by eventId
  //@route POST /api/ticket/event/:eventId/create
  //@access private
  createTicket = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { eventId } = req.params;
    const { storeId, name, zone, price, quantity, eventTimings } = req.body;

    // Check if the required fields are present
    if (!eventId || !storeId || !name || !price || !quantity || !eventTimings) {
      throw new HttpError(400, "Missing required fields");
    }

    const store = await StoreService.findById(storeId);
    if (!store) {
      throw new HttpError(400, "Store does not exist!");
    }

    if (store.sellerId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Check if eventTimings exist in the slotsAvailable of the corresponding event
    const event = await EventService.findById(eventId);
    if (!event) {
      throw new HttpError(404, "Event not found");
    }

    const matchingSlots = event.slotsAvailable.filter((slot) => {
      const slotStartTimeString = new Date(slot.startTime).toISOString();
      const slotEndTimeString = new Date(slot.endTime).toISOString();
      const eventStartTimeString = new Date(
        eventTimings.startTime
      ).toISOString();
      const eventEndTimeString = new Date(eventTimings.endTime).toISOString();

      return (
        eventStartTimeString >= slotStartTimeString &&
        eventEndTimeString <= slotEndTimeString
      );
    });

    if (!matchingSlots.length) {
      throw new HttpError(400, "Invalid event timings");
    }

    // Create the ticket
    const newTicket = await TicketService.create({
      eventId,
      storeId,
      name,
      zone,
      price,
      quantity,
      eventTimings,
    });

    Logger.info(`Ticket created by eventId: ${newTicket._id}`);
    Response(res)
      .status(200)
      .message("Ticket created by eventId")
      .body(newTicket)
      .send();
  };

  //@desc update a Ticket by ticketId
  //@route PUT /api/ticket/:ticketId
  //@access private
  updateTicket = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { ticketId } = req.params;
    const updateData = req.body;

    const ticket = await TicketService.findById(ticketId);
    if (!ticket) {
      throw new HttpError(404, "Ticket not found!");
    }
    const store = await StoreService.findById(ticket.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(ticket, updateData);

    const updatedTicket = await ticket.save();

    if (!updatedTicket) {
      throw new HttpError(404, "Ticket not found");
    }

    Logger.info(`Ticket updated by ticketId: ${updatedTicket}`);
    Response(res)
      .status(200)
      .message("Ticket updated by ticketId")
      .body(updatedTicket)
      .send();
  };

  //@desc delete a Ticket by ticketId
  //@route DELETE /api/ticket/:ticketId
  //@access private
  deleteTicket = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { ticketId } = req.params;

    const ticket = await TicketService.findById(ticketId);
    if (!ticket) {
      throw new HttpError(404, "Ticket not found!");
    }
    const store = await StoreService.findById(ticket.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedTicket = await TicketService.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      throw new HttpError(404, "Ticket not found");
    }

    Logger.info(`Ticket deleted by ticketId: ${deletedTicket}`);
    Response(res).status(200).message("Ticket deleted by ticketId").send();
  };
}

module.exports.TicketController = new TicketController();

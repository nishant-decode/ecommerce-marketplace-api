const { EventService } = require("../services/event.service");
const { AddressService } = require("../services/address.service");
const { StoreService } = require("../services/store.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class EventController {
  //@desc get all events
  //@route GET /api/event/
  //@access public
  getAllEvents = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params

    const events = await EventService.find(filters);

    Logger.info(`All events: ${events}`);
    Response(res).status(200).message("All events").body(events).send();
  };

  //@desc get event by eventId
  //@route GET /api/event/:eventId
  //@access public
  getEvent = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { eventId } = req.params;

    const event = await EventService.findById(eventId)
      .populate("storeId") // Populate the store details
      .populate("address"); // Populate the address details

    if (!event) {
      throw new HttpError(404, "Event not found");
    }

    Logger.info(`Event: ${event}`);
    Response(res).status(200).message("Event").body(event).send();
  };

  //@desc search events by search query
  //@route GET /api/event/search
  //@access public
  searchEvents = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Search query parameters

    const events = await EventService.search(filters);

    Logger.info(`Events found by search query: ${events}`);
    Response(res)
      .status(200)
      .message("Events found by search query")
      .body(events)
      .send();
  };

  //@desc create a event by storeId
  //@route PATCH /api/event/store/:storeId/listEvent
  //@access private
  listEvent = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.price ||
      !req.body.url ||
      !req.body.address ||
      !req.body.slotsAvailable
    ) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const store = await StoreService.findById(req.params.storeId);
    if (!store) {
      throw new HttpError(400, "Store does not exist!");
    }

    const address = await AddressService.findById(req.body.address);
    if (!address) {
      throw new HttpError(400, "Store address does not exist!");
    }

    const event = await EventService.create({
      storeId: store._id,
      ...req.body,
    });

    if (event) {
      Logger.info(`Event added successfully: ${event}`);
      Response(res)
        .status(201)
        .message("Event added successfully")
        .body({ event })
        .send();
    } else {
      throw new HttpError(400, "Event data is not valid");
    }
  };

  //@desc update event by eventId
  //@route PUT /api/event/:eventId
  //@access private
  updateEvent = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { eventId } = req.params;
    const updateData = req.body;

    const updatedEvent = await EventService.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      throw new HttpError(404, "Event not found");
    }

    Logger.info(`Event updated: ${updatedEvent}`);
    Response(res)
      .status(200)
      .message("Event updated successfully")
      .body(updatedEvent)
      .send();
  };

  //@desc delete event by eventId
  //@route DELETE /api/event/:eventId
  //@access private
  deleteEvent = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { eventId } = req.params;

    const deletedEvent = await EventService.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      throw new HttpError(404, "Event not found");
    }

    Logger.info(`Event deleted: ${deletedEvent}`);
    Response(res).status(200).message("Event deleted successfully").send();
  };
}

module.exports.EventController = new EventController();

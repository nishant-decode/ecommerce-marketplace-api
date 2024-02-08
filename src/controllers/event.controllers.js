const { EventService } = require("../services/event.service");
const { AddressService } = require("../services/address.service");
const { StoreService } = require("../services/store.service");
const { ReviewService } = require("../services/review.service");
const { TicketService } = require("../services/ticket.service");

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
  //@route GET /api/event/search?storeId=123&category=Music&minPrice=50&maxPrice=100&minRating=4
  //@access public
  searchEvents = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params
    const { minRating, storeId, category, minPrice, maxPrice } = req.query; // Extract additional filters

    let events = await EventService.find(filters);

    // Apply additional filters
    if (storeId) {
      events = events.filter((event) => event.storeId.toString() === storeId);
    }
    if (category) {
      events = events.filter((event) => event.category === category);
    }
    if (minPrice) {
      events = events.filter(
        (event) => event.price.original >= parseInt(minPrice)
      );
    }
    if (maxPrice) {
      events = events.filter(
        (event) => event.price.original <= parseInt(maxPrice)
      );
    }
    if (minRating) {
      const eventIds = events.map((event) => event._id);
      const reviews = await ReviewService.find({
        reviewedlistings: { $in: eventIds },
      });
      events = this.filterEventsByMinRating(
        events,
        reviews,
        parseInt(minRating)
      );
    }

    Logger.info(`Filtered events: ${events}`);
    Response(res).status(200).message("Filtered events").body(events).send();
  };

  filterEventsByMinRating = (events, reviews, minRating) => {
    return events.filter((event) => {
      const eventReviews = reviews.filter((review) =>
        review.reviewedlistings.includes(event._id)
      );
      const averageRating = this.calculateAverageRating(eventReviews);
      return averageRating >= minRating;
    });
  };

  calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
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

    if (store.sellerId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
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

    const event = await EventService.findById(eventId);
    if (!event) {
      throw new HttpError(404, "Event not found!");
    }
    const store = await StoreService.findById(event.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(event, updateData);

    const updatedEvent = await event.save();

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

    const event = await EventService.findById(eventId);
    if (!event) {
      throw new HttpError(404, "Event not found!");
    }
    const store = await StoreService.findById(event.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedEvent = await EventService.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      throw new HttpError(404, "Event not found");
    }

    await TicketService.deleteMany({ eventId });

    Logger.info(`Event deleted: ${deletedEvent}`);
    Response(res).status(200).message("Event deleted successfully").send();
  };
}

module.exports.EventController = new EventController();

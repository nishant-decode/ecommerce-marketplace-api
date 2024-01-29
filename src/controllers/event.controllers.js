const { EventService } = require("../services/event.service");
const { SellerService } = require("../services/seller.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class EventController {
  //@desc Register a seller
  //@route PATCH /api/seller/createStore
  //@access public
  listEvent = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    if (!req.body.name || !req.body.category || !req.body.price || !req.body.url || !req.body.tickets) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await SellerService.findById(req.params.id);
    if (!seller) {
      throw new HttpError(400, "Seller does not exist!");
    }

    const event = await EventService.create({ 
      seller: seller._id,
      ...req.body
    });

    if (event) {
      seller.listings.events.push(event._id);
      await seller.save();
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
}

module.exports.EventController = new EventController();
const { SellerService } = require("../services/seller.service");
const BasicUserController = require("./basicUser.controllers");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class SellerController extends BasicUserController {
  constructor() {
    super(SellerService);
  }

  //@desc Register a seller
  //@route PATCH /api/seller/createStore
  //@access public
  createStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeName, type, category, location, offers } = req.body;

    if (!storeName || !type || !category || !location || !offers) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await this.service.findById(req.params.id);
    if (!seller) {
      throw new HttpError(400, "User does not exist!");
    }

    const sellerStore = await this.service.findByIdAndUpdate(req.params.id , { 
      storeName,
      type,
      category,
      location,
      offers
    });

    if (sellerStore) {
      Logger.info(`Seller Store updated: ${sellerStore}`);
      Response(res)
        .status(201)
        .message("Seller Store updated successfully")
        .body({ sellerStore })
        .send();
    } else {
      throw new HttpError(400, "Seller data is not valid");
    }
  };
}

module.exports.SellerController = new SellerController();
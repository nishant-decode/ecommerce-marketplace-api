const { ServiceService } = require("../services/service.service");
const { SellerService } = require("../services/seller.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ServiceController {
  //@desc Register a seller
  //@route PATCH /api/seller/createStore
  //@access public
  listService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name, category, price, location, available, info, details, url, variants } = req.body;

    if (!name || !category || !price || !url) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await SellerService.findById(req.params.id);
    if (!seller) {
      throw new HttpError(400, "Seller does not exist!");
    }

    const service = await ServiceService.create({ 
      name,
      seller: seller._id,
      category,
      price,
      location,
      available,
      info,
      details,
      url,
      variants
    });

    if (service) {
      Logger.info(`Service added successfully: ${service}`);
      Response(res)
        .status(201)
        .message("Service added successfully")
        .body({ service })
        .send();
    } else {
      throw new HttpError(400, "Service data is not valid");
    }
  };
}

module.exports.ServiceController = new ServiceController();
const { ServiceService } = require("../services/service.service");
const { StoreService } = require("../services/store.service");
const { AddressService } = require("../services/address.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ServiceController {
  //@desc get all services
  //@route GET /api/service/
  //@access public
  getAllServices = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`All services:`);
    Response(res)
      .status(200)
      .message("All services")
      .body()
      .send();
  };

  //@desc get a service by serviceId
  //@route GET /api/service/:serviceId
  //@access public
  getService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`service by serviceId:`);
    Response(res)
      .status(200)
      .message("service by serviceId")
      .body()
      .send();
  };

  //@desc search for services by search query
  //@route GET /api/service/search
  //@access public
  searchServices = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`services found by search query:`);
    Response(res)
      .status(200)
      .message("services found by search query")
      .body()
      .send();
  };

  //@desc Register a service
  //@route PATCH /api/service/store/:storeId/listService
  //@access private
  listService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    if (!req.body.name || !req.body.category || !req.body.providerAddress || !req.body.url) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const store = await StoreService.findById(req.params.storeId);
    if (!store) {
      throw new HttpError(400, "Store does not exist!");
    }

    const address = await AddressService.findById(req.body.providerAddress);
    if (!address) {
      throw new HttpError(400, "Store address does not exist!");
    }

    const service = await ServiceService.create({ 
      storeId: req.params.storeId,
      ...req.body
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

  //@desc update a service by serviceId
  //@route PUT /api/service/:serviceId
  //@access private
  updateService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`service updated by serviceId:`);
    Response(res)
      .status(200)
      .message("service updated by serviceId")
      .body()
      .send();
  };

  //@desc delete a service by serviceId
  //@route DELETE /api/service/:serviceId
  //@access private
  deleteService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`service deleted by serviceId:`);
    Response(res)
      .status(200)
      .message("service deleted by serviceId")
      .body()
      .send();
  };
}

module.exports.ServiceController = new ServiceController();
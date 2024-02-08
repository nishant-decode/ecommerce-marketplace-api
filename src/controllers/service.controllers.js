const { ServiceService } = require("../services/service.service");
const { StoreService } = require("../services/store.service");
const { AddressService } = require("../services/address.service");
const { ReviewService } = require("../services/review.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ServiceController {
  //@desc get all services
  //@route GET /api/service/
  //@access public
  getAllServices = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params

    const services = await ServiceService.find(filters);

    Logger.info(`All services: ${services}`);
    Response(res).status(200).message("All services").body(services).send();
  };

  //@desc get a service by serviceId
  //@route GET /api/service/:serviceId
  //@access public
  getService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { serviceId } = req.params;

    const service = await ServiceService.findById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    Logger.info(`Service by serviceId: ${service}`);
    Response(res)
      .status(200)
      .message("Service by serviceId")
      .body(service)
      .send();
  };

  //@desc search for services by search query
  //@route GET /api/service/search?storeId=456&category=Cleaning&minPrice=20&maxPrice=50&minRating=3
  //@access public
  searchServices = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params
    const { minRating, storeId, category, minPrice, maxPrice } = req.query; // Extract additional filters

    let services = await ServiceService.find(filters);

    if (storeId) {
      services = services.filter(
        (service) => service.storeId.toString() === storeId
      );
    }
    if (category) {
      services = services.filter((service) => service.category === category);
    }
    if (minPrice) {
      services = services.filter(
        (service) => service.price.original >= parseInt(minPrice)
      );
    }
    if (maxPrice) {
      services = services.filter(
        (service) => service.price.original <= parseInt(maxPrice)
      );
    }
    if (minRating) {
      const serviceIds = services.map((service) => service._id);
      const reviews = await ReviewService.find({
        reviewedlistings: { $in: serviceIds },
      });
      services = this.filterServicesByMinRating(
        services,
        reviews,
        parseInt(minRating)
      );
    }

    Logger.info(`Filtered services: ${services}`);
    Response(res)
      .status(200)
      .message("Filtered services")
      .body(services)
      .send();
  };

  filterServicesByMinRating = (services, reviews, minRating) => {
    return services.filter((service) => {
      const serviceReviews = reviews.filter((review) =>
        review.reviewedlistings.includes(service._id)
      );
      const averageRating = this.calculateAverageRating(serviceReviews);
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

  //@desc Register a service
  //@route PATCH /api/service/store/:storeId/listService
  //@access private
  listService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.providerAddress ||
      !req.body.url
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

    const address = await AddressService.findById(req.body.providerAddress);
    if (!address) {
      throw new HttpError(400, "Store address does not exist!");
    }

    const service = await ServiceService.create({
      storeId: req.params.storeId,
      ...req.body,
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

    const { serviceId } = req.params;
    const updateData = req.body;

    const service = await ServiceService.findById(serviceId);
    if (!service) {
      throw new HttpError(404, "Service not found!");
    }
    const store = await StoreService.findById(service.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(service, updateData);

    const updatedService = await service.save();

    if (!updatedService) {
      throw new HttpError(404, "Product not found");
    }

    Logger.info(`Service updated by serviceId: ${updatedService}`);
    Response(res)
      .status(200)
      .message("Service updated by serviceId")
      .body(updatedService)
      .send();
  };

  //@desc delete a service by serviceId
  //@route DELETE /api/service/:serviceId
  //@access private
  deleteService = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { serviceId } = req.params;

    const service = await ServiceService.findById(serviceId);
    if (!service) {
      throw new HttpError(404, "Service not found!");
    }
    const store = await StoreService.findById(service.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedService = await ServiceService.findByIdAndDelete(serviceId);

    if (!deletedService) {
      throw new HttpError(404, "Service not found");
    }

    Logger.info(`Service deleted by serviceId: ${deletedService}`);
    Response(res).status(200).message("Service deleted by serviceId").send();
  };
}

module.exports.ServiceController = new ServiceController();

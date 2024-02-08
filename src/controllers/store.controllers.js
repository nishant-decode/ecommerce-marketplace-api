const { StoreService } = require("../services/store.service");
const { UserService } = require("../services/user.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class StoreController {
  //@desc get a store by storeId
  //@route GET /api/store/:storeId
  //@access public
  getStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;

    const store = await StoreService.findById(storeId);

    if (!store) {
      throw new HttpError(404, "Store not found");
    }

    Logger.info(`Store by storeId: ${store}`);
    Response(res).status(200).message("Store by storeId").body(store).send();
  };

  //@desc get all stores
  //@route GET /api/store/
  //@access public
  getAllStores = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params

    const stores = await StoreService.find(filters);

    Logger.info(`All stores: ${stores}`);
    Response(res).status(200).message("All Stores").body(stores).send();
  };

  //@desc create a store
  //@route POST /api/store/seller/:sellerId/create
  //@access private
  createStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeName, description } = req.body;

    const sellerId = req.params.sellerId;

    if (!storeName || !description) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await UserService.findById(sellerId);
    if (!seller) {
      throw new HttpError(400, "User does not exist!");
    }

    const store = await StoreService.find({ sellerId });

    if (store) {
      throw new HttpError(400, "Seller already has a store!");
    }

    const sellerStore = await StoreService.create({
      ...req.body,
      sellerId,
    });

    if (sellerStore) {
      Logger.info(`Seller Store created: ${sellerStore}`);
      Response(res)
        .status(201)
        .message("Seller Store created successfully")
        .body({ sellerStore })
        .send();
    } else {
      throw new HttpError(400, "Seller data is not valid");
    }
  };

  //@desc update a store by storeId
  //@route PUT /api/store/:storeId
  //@access private
  updateStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;
    const updateData = req.body;

    const updatedStore = await StoreService.findByIdAndUpdate(
      storeId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedStore) {
      throw new HttpError(404, "Store not found");
    }

    Logger.info(`Store updated by storeId: ${updatedStore}`);
    Response(res)
      .status(200)
      .message("Store updated by storeId")
      .body(updatedStore)
      .send();
  };

  //@desc delete a store by storeId
  //@route DELETE /api/store/:storeId
  //@access private
  deleteStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;

    const deletedStore = await StoreService.findByIdAndDelete(storeId);

    if (!deletedStore) {
      throw new HttpError(404, "Store not found");
    }

    Logger.info(`Store deleted by storeId: ${deletedStore}`);
    Response(res).status(200).message("Store deleted by storeId").send();
  };
}

module.exports.StoreController = new StoreController();

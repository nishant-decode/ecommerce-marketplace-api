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

    //logic

    Logger.info(`store by storeId:`);
    Response(res)
      .status(200)
      .message("store by storeId")
      .body()
      .send();
  };

  //@desc get all stores
  //@route GET /api/store/
  //@access public
  getAllStores = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`all stores`);
    Response(res)
      .status(200)
      .message("all stores")
      .body()
      .send();
  };

  //@desc create a store
  //@route POST /api/store/seller/:sellerId/create
  //@access private
  createStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeName, description } = req.body;

    const sellerId = req.params.sellerId

    if (!storeName || !description) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await UserService.findById(sellerId);
    if (!seller) {
      throw new HttpError(400, "User does not exist!");
    }

    const sellerStore = await StoreService.create({ 
      ...req.body,
      sellerId
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

    //logic

    Logger.info(`store updated by storeId:`);
    Response(res)
      .status(200)
      .message("store updated by storeId")
      .body()
      .send();
  };

  //@desc delete a store by storeId
  //@route DELETE /api/store/:storeId
  //@access private
  deleteStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`store deleted by storeId:`);
    Response(res)
      .status(200)
      .message("store deleted by storeId")
      .body()
      .send();
  };
}

module.exports.StoreController = new StoreController();
const mongoose = require("mongoose");
const { UserService } = require("../services/user.service");
const BasicUserController = require("./basicUser.controllers");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class UserController extends BasicUserController {
  constructor() {
    super(UserService);
  }

  addToCart = async (req, res) => {
    const { listingType, itemId, specifications, quantity } = req.body;
    const userId = req.params.id;

    const user = await this.service.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Validate listingType
    if (!["Product", "Service", "Event"].includes(listingType)) {
      throw new HttpError(400, "Invalid listingType");
    }

    // Validate itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new HttpError(400, "Invalid itemId");
    }

    // Validate quantity
    if (listingType === "Product" || listingType === "Event") {
      if (!quantity || quantity < 1) {
        throw new HttpError(400, "Quantity should be at least 1");
      }
    }

    // Create item object
    const item = {
      [`${listingType.toLowerCase()}Id`]: itemId,
      specifications,
      quantity,
    };

    // Add item to cart
    user.cart[`${listingType.toLowerCase()}s`].push(item);

    // Save the user
    await user.save();

    Logger.info(`Item added to cart successfully: ${item}`);
    Response(res)
      .status(201)
      .message("Item added to cart successfully")
      .body({ item })
      .send();
  };

  getAllCartItems = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;

    // Find the user by ID
    const user = await this.service.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Get all items in the cart
    const cartItems = {
      products: user.cart.products,
      services: user.cart.services,
      events: user.cart.events,
    };

    Logger.info(`Retrieved all items from the cart`);
    Response(res).status(200).body({ cartItems }).send();
  };

  deleteCartItem = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;
    const { listingType, itemId } = req.query;

    const user = await this.service.findById(userId);

    // Check if the listingType is valid
    if (!["Product", "Service", "Event"].includes(listingType)) {
      throw new HttpError(400, "Invalid listingType");
    }

    // Find the index of the item in the cart
    const itemIndex = user.cart[`${listingType.toLowerCase()}s`].findIndex(
      (item) => item[`${listingType.toLowerCase()}Id`] == itemId
    );

    // If the item is not found, return an error
    if (itemIndex === -1) {
      throw new HttpError(404, "Item not found in the cart");
    }

    // Remove the item from the cart
    user.cart[`${listingType.toLowerCase()}s`].splice(itemIndex, 1);

    // Save the updated user
    await user.save();

    Logger.info(`Item removed successfully from the cart`);
    Response(res).status(200).message("Item removed successfully").send();
  };
}

module.exports.UserController = new UserController();

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { CartService } = require("../services/cart.service");
const { ProductService } = require("../services/product.service");
const { ServiceService } = require("../services/service.service");
const { TicketService } = require("../services/ticket.service");

class CartController {
  //@desc get all cart items
  //@route GET /api/cart/:cartId
  //@access private
  getCart = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { cartId } = req.params;

    // Fetch cart
    const cart = await CartService.findById(cartId);

    // Validate cart
    if (!cart) {
      throw new HttpError(404, "Cart not found");
    }

    Logger.info(`User's cart retrieved successfully`);
    Response(res).status(200).message("User's cart retrieved successfully").body({ cart }).send();
  };

  //@desc add item to cart
  //@route POST /api/cart/user/:userId/:itemType/:itemId/
  //@access private
  addToCart = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId, itemType, itemId } = req.params;

    if (!["product", "service", "event"].includes(itemType)) {
      throw new HttpError(400, "Invalid item type. Must be 'product', 'service', or 'event'");
    }

    // Fetch cart for the user
    let cart = await CartService.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = await CartService.create({ userId });
    }

    switch (itemType) {
      case "product":
        await this.addToProduct(cart, itemId, req.body.quantity, req.body.note);
        break;
      case "service":
        await this.addToService(cart, itemId, req.body.additionalServices, req.body.note);
        break;
      case "event":
        await this.addToEvent(cart, itemId, req.body.quantity);
        break;
      default:
        throw new HttpError(400, "Invalid item type");
    }

    Logger.info(`Item added to the cart successfully`);
    Response(res).status(200).message("Item added to the cart successfully").body().send();
  };

  // Helper function to add a product to the cart
  async addToProduct(cart, productVariantId, quantity, note) {
    const product = await ProductService.findById(productVariantId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    cart.products.push({
      productVariantId,
      quantity,
      note
    });

    await cart.save();
  }

  // Helper function to add a service to the cart
  async addToService(cart, serviceId, additionalServices, note) {
    const service = await ServiceService.findById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    cart.services.push({
      serviceId,
      additionalServices,
      note
    });

    await cart.save();
  }

  // Helper function to add an event to the cart
  async addToEvent(cart, ticketId, quantity) {
    const event = await TicketService.findById(ticketId);

    if (!event) {
      throw new HttpError(404, "Event not found");
    }

    cart.events.push({
      ticketId,
      quantity,
    });

    await cart.save();
  }

  //@desc update item in user's cart by cartId, itemType, and itemId
  //@route PUT /api/cart/:cartId/:itemType/:itemId
  //@access private
  updateCart = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { cartId, itemType, itemId } = req.params;
    const { quantity, note } = req.body;

    // Fetch user's cart
    const userCart = await CartService.findById(cartId);

    // Validate if cart was found
    if (!userCart) {
      throw new HttpError(404, "Cart not found");
    }

    // Update the item based on itemType
    switch (itemType) {
      case "product":
        const productIndex = userCart.products.findIndex((product) => product.productVariantId.toString() === itemId);
        if (productIndex !== -1) {
          if (quantity !== undefined) {
            userCart.products[productIndex].quantity = quantity;
          }
          if (note !== undefined) {
            userCart.products[productIndex].note = note;
          }
        }
        break;
      case "service":
        const serviceIndex = userCart.services.findIndex((service) => service.serviceId.toString() === itemId);
        if (serviceIndex !== -1) {
          if (quantity !== undefined) {
            userCart.services[serviceIndex].quantity = quantity;
          }
          if (note !== undefined) {
            userCart.services[serviceIndex].note = note;
          }
        }
        break;
      case "event":
        const eventIndex = userCart.events.findIndex((event) => event.ticketId.toString() === itemId);
        if (eventIndex !== -1) {
          if (quantity !== undefined) {
            userCart.events[eventIndex].quantity = quantity;
          }
        }
        break;
      default:
        throw new HttpError(400, "Invalid item type");
    }

    // Save the updated cart
    await userCart.save();

    Logger.info(`Item updated in the user's cart successfully`);
    Response(res).status(200).message("Item updated in the user's cart successfully").body().send();
  };

  //@desc remove item from user's cart by cartId, itemType, and itemId
  //@route DELETE /api/cart/:cartId/:itemType/:itemId
  //@access private
  removeCartItem = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { cartId, itemType, itemId } = req.params;

    const userCart = await CartService.findById(cartId);

    if (!userCart) {
      throw new HttpError(404, "Cart not found");
    }

    switch (itemType) {
      case "product":
        userCart.products = userCart.products.filter((product) => product.productVariantId.toString() !== itemId);
        break;
      case "service":
        userCart.services = userCart.services.filter((service) => service.serviceId.toString() !== itemId);
        break;
      case "event":
        userCart.events = userCart.events.filter((event) => event.ticketId.toString() !== itemId);
        break;
      default:
        throw new HttpError(400, "Invalid item type");
    }

    await userCart.save();

    Logger.info(`Item removed successfully from the cart`);
    Response(res).status(200).message("Item removed successfully").send();
  };

  //@desc delete cart
  //@route DELETE /api/cart/:cartId
  //@access private
  deleteCart = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { cartId } = req.params;

    // Fetch and delete cart
    const deletedCart = await CartService.findByIdAndDelete(cartId);

    // Validate if cart was found and deleted
    if (!deletedCart) {
      throw new HttpError(404, "Cart not found");
    }

    Logger.info(`Cart deleted:`);
    Response(res).status(200).message('Cart deleted').body().send();
  };
}

module.exports.CartController = new CartController();
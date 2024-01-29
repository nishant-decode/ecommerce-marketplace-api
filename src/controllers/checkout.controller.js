const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { UserService } = require("../services/user.service");
const { OrderService } = require("../services/order.service");
const { ProductService } = require("../services/product.service");
const { ServiceService } = require("../services/service.service");
const { EventService } = require("../services/event.service");

class CheckoutController {
  calculateTotalProduct = async (productItem) => {
    const productId = productItem.productId;

    // Validate product
    if (!productId) {
      throw new HttpError(404, "Product not found in the cart");
    }

    const productDetails = await ProductService.findById(productId);

    // Calculate the total price for the product item
    const itemTotal =
      ((productDetails.price.original * productDetails.price.discount) / 100) *
      productItem.quantity;
    return itemTotal;
  };

  calculateTotalService = async (serviceItem) => {
    const serviceId = serviceItem.serviceId;

    // Validate product
    if (!serviceId) {
      throw new HttpError(404, "Service not found in the cart");
    }

    const serviceDetails = await ServiceService.findById(serviceId);

    // Calculate the total price for the product item
    const itemTotal =
      (serviceDetails.price.original * serviceDetails.price.discount) / 100;
    return itemTotal;
  };

  calculateTotalEvent = async (eventItem) => {
    const eventId = eventItem.eventId;

    // Validate product
    if (!eventId) {
      throw new HttpError(404, "Event not found in the cart");
    }

    const eventDetails = await EventService.findById(eventId);

    // Calculate the total price for the product item
    const itemTotal =
      ((eventDetails.price.original * eventDetails.price.discount) / 100) *
      eventItem.quantity;
    return itemTotal;
  };

  applyDiscounts = async (totalAmount) => {
    // For simplicity, let's assume there is a single offer with a 10% discount
    const discountPercentage = 10;
    const discountAmount = (totalAmount * discountPercentage) / 100;

    // Subtract the discount amount from the total amount
    return totalAmount - discountAmount;
  };

  calculateTotal = async (cartItems, calculateTotalFunction) => {
    let total = 0;

    for (const cartItem of cartItems) {
      total += await calculateTotalFunction(cartItem);
    }

    // Apply discounts
    const discountedAmount = await this.applyDiscounts(total);

    return discountedAmount;
  };

  calculateTotalAmount = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;

    // Fetch user and their cart
    const user = await UserService.findById(userId)
      .populate("cart.products.productId")
      .populate("cart.services.serviceId")
      .populate("cart.events.eventId");

    // Validate user and cart
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (
      !user.cart ||
      !user.cart.products ||
      !user.cart.services ||
      !user.cart.events ||
      (user.cart.products.length === 0 &&
        user.cart.services.length === 0 &&
        user.cart.events.length === 0)
    ) {
      throw new HttpError(400, "Cart is empty");
    }

    // Calculate total discounted amount for each item type
    const discountedProductAmount = await this.calculateTotal(
      user.cart.products,
      this.calculateTotalProduct
    );
    const discountedServiceAmount = await this.calculateTotal(
      user.cart.services,
      this.calculateTotalService
    );
    const discountedEventAmount = await this.calculateTotal(
      user.cart.events,
      this.calculateTotalEvent
    );

    Logger.info(
      `Cart total value: Products: ${discountedProductAmount} Services: ${discountedServiceAmount} Events: ${discountedEventAmount}`
    );
    Response(res)
      .status(200)
      .message(
        `Cart total value: Products: ${discountedProductAmount} Services: ${discountedServiceAmount} Events: ${discountedEventAmount}`
      )
      .body({
        discountedProductAmount,
        discountedServiceAmount,
        discountedEventAmount,
      })
      .send();
  };

  checkout = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;

    // Fetch user and their cart
    const user = await UserService.findById(userId)
      .populate("cart.products.productId")
      .populate("cart.services.serviceId")
      .populate("cart.events.eventId");

    // Validate user and cart
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (
      !user.cart ||
      !user.cart.products ||
      !user.cart.services ||
      !user.cart.events ||
      (user.cart.products.length === 0 &&
        user.cart.services.length === 0 &&
        user.cart.events.length === 0)
    ) {
      throw new HttpError(400, "Cart is empty");
    }

    // Calculate total amount for each item type
    const discountedProductAmount = await this.calculateTotal(
      user.cart.products,
      this.calculateTotalProduct
    );
    const discountedServiceAmount = await this.calculateTotal(
      user.cart.services,
      this.calculateTotalService
    );
    const discountedEventAmount = await this.calculateTotal(
      user.cart.events,
      this.calculateTotalEvent
    );

    // Create separate orders for each item type
    const productOrder = await (user.cart.products.length
      ? OrderService.create({
          userId,
          orderType: "Product",
          listingId: user.cart.products.map((item) => item.productId),
          address: req.body.address,
          totalAmount: discountedProductAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    const serviceOrder = await (user.cart.services.length
      ? OrderService.create({
          userId,
          orderType: "Service",
          listingId: user.cart.services.map((item) => item.serviceId),
          address: req.body.address,
          totalAmount: discountedServiceAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    const eventOrder = await (user.cart.events.length
      ? OrderService.create({
          userId,
          orderType: "Event",
          listingId: user.cart.events.map((item) => item.eventId),
          totalAmount: discountedEventAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    // Clear the user's cart
    user.cart.products = [];
    user.cart.services = [];
    user.cart.events = [];
    await user.save();

    Logger.info(
      `Orders placed successfully ${productOrder} ${serviceOrder} ${eventOrder}`
    );
    Response(res)
      .status(200)
      .message("Orders placed successfully")
      .body({ productOrder, serviceOrder, eventOrder })
      .send();
  };
}

module.exports.CheckoutController = new CheckoutController();

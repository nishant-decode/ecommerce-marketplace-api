const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { OrderService } = require("../services/order.service");
const { CartService } = require("../services/cart.service");

class OrderController {
  //@desc get all orders
  //@route GET /api/order/
  //@access private
  getAllOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
  
    // Get all orders logic
    const orders = await OrderService.find({});
  
    Logger.info(`All orders:`);
    Response(res)
      .status(200)
      .message("All orders")
      .body(orders)
      .send();
  };

  //@desc get order by orderId
  //@route GET /api/order/:orderId
  //@access private
  getOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId } = req.params;

    // Get order by orderId logic
    const order = await OrderService.findById(orderId);

    Logger.info(`Order:`);
    Response(res)
      .status(200)
      .message("Order")
      .body(order)
      .send();
  };

  //@desc search all orders by search query
  //@route GET /api/order/search
  //@access private
  searchAllOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Orders found by search query:`);
    Response(res)
      .status(200)
      .message("Orders found by search query")
      .body()
      .send();
  };

  //@desc get all store orders
  //@route GET /api/order/store/:storeId/
  //@access private
  getAllStoreOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;

    // Get all store orders logic
    const storeOrders = await OrderService.find({ storeId });

    Logger.info(`Store orders:`);
    Response(res)
      .status(200)
      .message("Store orders")
      .body(storeOrders)
      .send();
  };

  //@desc get store order by orderId
  //@route GET /api/order/:orderId/store/:storeId/
  //@access private
  getStoreOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId, storeId } = req.params;

    // Get store order by orderId logic
    const storeOrder = await OrderService.findOne({ _id: orderId, storeId });

    Logger.info(`Store order:`);
    Response(res)
      .status(200)
      .message("Store order")
      .body(storeOrder)
      .send();
  };

  //@desc get all store orders by search query
  //@route GET /api/order/store/:storeId/search
  //@access private
  searchStoreOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Store orders found by search query:`);
    Response(res)
      .status(200)
      .message("Store orders found by search query")
      .body()
      .send();
  };

  //@desc get all user orders
  //@route GET /api/order/user/:userId/
  //@access private
  getAllUserOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId } = req.params;

    // Get all user orders logic
    const userOrders = await OrderService.find({ userId });

    Logger.info(`User orders:`);
    Response(res)
      .status(200)
      .message("User orders")
      .body(userOrders)
      .send();
  };

  //@desc get user order
  //@route GET /api/order/:orderId/user/:userId
  //@access private
  getUserOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId, userId } = req.params;

    // Validate orderId and userId
    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw HttpError(400, "Invalid orderId or userId");
    }

    // Get user order by orderId logic
    const userOrder = await OrderService.findOne({ _id: orderId, userId });

    Logger.info(`User order:`);
    Response(res)
      .status(200)
      .message("User order")
      .body(userOrder)
      .send();
  };

  //@desc get all user orders by search query
  //@route GET /api/order/user/:userId/search
  //@access private
  searchUserOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`User orders found by search query:`);
    Response(res)
      .status(200)
      .message("User orders found by search query")
      .body()
      .send();
  };

  //@desc create order by userId
  //@route POST /api/order/user/:userId/createOrder
  //@access private
  createOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.userId;

    // Fetch cart
    const cart = await CartService.find({ userId })

    // Validate cart
    if (!cart) {
      throw new HttpError(404, "Cart not found");
    }

    if (
      !cart.products ||
      !cart.services ||
      !cart.events ||
      (cart.products.length === 0 &&
        cart.services.length === 0 &&
        cart.events.length === 0)
    ) {
      throw new HttpError(400, "Cart is empty");
    }

    //fetch total amount for each item type from cart
    const productTotalAmount = cart.couponDiscountedPrice.product;
    const serviceTotalAmount = cart.couponDiscountedPrice.service;
    const eventTotalAmount = cart.couponDiscountedPrice.event;
    

    // Create separate orders for each item type
    const productOrder = await (cart.products.length
      ? OrderService.create({
          userId,
          orderType: "Product",
          listingId: cart.products.map((item) => item.productVariantId),
          address: req.body.address,
          totalAmount: discountedProductAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    const serviceOrder = await (cart.services.length
      ? OrderService.create({
          userId,
          orderType: "Service",
          listingId: cart.services.map((item) => item.serviceId),
          address: req.body.address,
          totalAmount: discountedServiceAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    const eventOrder = await (cart.events.length
      ? OrderService.create({
          userId,
          orderType: "Event",
          listingId: cart.events.map((item) => item.ticketId),
          totalAmount: discountedEventAmount,
          paymentMethod: req.body.paymentMethod,
        })
      : null);

    // Clear the user's cart
    cart.products = [];
    cart.services = [];
    cart.events = [];
    await cart.save();

    Logger.info(
      `Orders placed successfully ${productOrder} ${serviceOrder} ${eventOrder}`
    );
    Response(res)
      .status(200)
      .message("Orders placed successfully")
      .body({ productOrder, serviceOrder, eventOrder })
      .send();
  };

  //@desc update order
  //@route PUT /api/order/:orderId
  //@access private
  updateOrderStatus = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || typeof status !== "string") {
      throw new HttpError(400, "Invalid status");
    }

    // Update order status logic
    const updatedOrder = await OrderService.findByIdAndUpdate(orderId, { status }, { new: true });

    Logger.info(`Order status updated: ${updatedOrder}`);
    Response(res)
      .status(200)
      .message("Order status updated")
      .body({ updatedOrder })
      .send();
  };

  //@desc delete order
  //@route DELETE /api/order/:orderId
  //@access private
  deleteOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId } = req.params;

    // Delete order logic
    const deletedOrder = await OrderService.findByIdAndDelete(orderId);

    Logger.info(`Order deleted: ${deletedOrder}`);
    Response(res)
      .status(200)
      .message("Order deleted")
      .body({ deletedOrder })
      .send();
  };

}

module.exports.OrderController = new OrderController();

// checkout = async (req, res) => {
  
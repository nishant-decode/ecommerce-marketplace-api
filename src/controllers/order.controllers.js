const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");
const { sendNotification } = require("../helpers/notification.helper");

const { OrderService } = require("../services/order.service");
const { CartService } = require("../services/cart.service");
const { StoreService } = require("../services/store.service");
const { ProductVariantService } = require("../services/productVariant.service");
const { ServiceService } = require("../services/service.service");
const { TicketService } = require("../services/ticket.service");

class OrderController {
  //@desc get all orders
  //@route GET /api/order/
  //@access private
  getAllOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    // Get all orders logic
    const orders = await OrderService.find({});

    Logger.info(`All orders:`);
    Response(res).status(200).message("All orders").body(orders).send();
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
    Response(res).status(200).message("Order").body(order).send();
  };

  //@desc search all orders by search query
  //@route GET /api/order/search
  //@access private
  searchAllOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId, listingType, orderStatus } = req.query;

    // Construct search filter based on provided parameters
    const searchFilter = {};

    if (listingType) {
      searchFilter["listings.listingType"] = listingType;
    }

    if (orderStatus) {
      searchFilter["listings.status"] = orderStatus;
    }

    // Query all orders based on the constructed filter
    const orders = await OrderService.find(searchFilter);

    let filteredOrders = orders;

    // If storeId is provided, filter orders by matching storeId in the listings
    if (storeId) {
      filteredOrders = orders.filter((order) => {
        return order.listings.some((listing) => {
          if (!listing.listingType || !listing.listingId) {
            return false;
          }
          switch (listing.listingType) {
            case "Product":
              return this.findStoreIdByProductId(listing.listingId) === storeId;
            case "Service":
              return this.findStoreIdByServiceId(listing.listingId) === storeId;
            case "Event":
              return this.findStoreIdByTicketId(listing.listingId) === storeId;
            default:
              return false;
          }
        });
      });
    }

    Logger.info(`Orders found by search query:`);
    Response(res)
      .status(200)
      .message("Orders found by search query")
      .body(filteredOrders)
      .send();
  };

  findStoreIdByProductId = async (productId) => {
    const productVariant = await ProductVariantService.findOne({ productId });
    if (productVariant) {
      return productVariant.storeId;
    }
    return null;
  };

  findStoreIdByServiceId = async (serviceId) => {
    const service = await ServiceService.findById(serviceId);
    if (service) {
      return service.storeId;
    }
    return null;
  };

  findStoreIdByTicketId = async (ticketId) => {
    const ticket = await TicketService.findById(ticketId);
    if (ticket) {
      return ticket.storeId;
    }
    return null;
  };

  //@desc get all store orders
  //@route GET /api/order/store/:storeId/
  //@access private
  getAllStoreOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;

    const store = await StoreService.findById(storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Get all store orders logic
    const storeOrders = await OrderService.find({ storeId });

    Logger.info(`Store orders:`);
    Response(res).status(200).message("Store orders").body(storeOrders).send();
  };

  //@desc get store order by orderId
  //@route GET /api/order/:orderId/store/:storeId/
  //@access private
  getStoreOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId, storeId } = req.params;

    const store = await StoreService.findById(storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Get store order by orderId logic
    const storeOrder = await OrderService.findOne({ _id: orderId, storeId });

    Logger.info(`Store order:`);
    Response(res).status(200).message("Store order").body(storeOrder).send();
  };

  //@desc get all store orders by search query
  //@route GET /api/order/store/:storeId/search
  //@access private
  searchStoreOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;

    const store = await StoreService.findById(storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Step 2: Query all orders from the database
    const orders = await OrderService.find({});

    // Step 3: Filter the orders based on the store ID found in the listings of each order
    const storeOrders = orders.filter((order) => {
      return order.listings.some((listing) => {
        if (!listing.listingType || !listing.listingId) {
          return false;
        }
        switch (listing.listingType) {
          case "Product":
            return this.findStoreIdByProductId(listing.listingId) === storeId;
          case "Service":
            return this.findStoreIdByServiceId(listing.listingId) === storeId;
          case "Event":
            return this.findStoreIdByTicketId(listing.listingId) === storeId;
          default:
            return false;
        }
      });
    });

    // Step 4: Return the filtered orders
    Logger.info(`Store orders found for storeId ${storeId}:`);
    Response(res)
      .status(200)
      .message("Store orders found")
      .body(storeOrders)
      .send();
  };

  //@desc get all user orders
  //@route GET /api/order/user/:userId/
  //@access private
  getAllUserOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId } = req.params;

    if (
      userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Get all user orders logic
    const userOrders = await OrderService.find({ userId });

    Logger.info(`User orders:`);
    Response(res).status(200).message("User orders").body(userOrders).send();
  };

  //@desc get user order
  //@route GET /api/order/:orderId/user/:userId
  //@access private
  getUserOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId, userId } = req.params;

    if (
      userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Validate orderId and userId
    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw HttpError(400, "Invalid orderId or userId");
    }

    // Get user order by orderId logic
    const userOrder = await OrderService.findOne({ _id: orderId, userId });

    Logger.info(`User order:`);
    Response(res).status(200).message("User order").body(userOrder).send();
  };

  //@desc get all user orders by search query
  //@route GET /api/order/user/:userId/search
  //@access private
  searchUserOrders = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId } = req.params;
    const { status } = req.query;

    if (
      userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    let userOrders = await OrderService.find({ userId });

    if (status) {
      userOrders = userOrders.filter((order) => {
        return order.listings.some((listing) => listing.status === status);
      });
    }

    Logger.info(`User orders found by search query:`);
    Response(res)
      .status(200)
      .message("User orders found by search query")
      .body(userOrders)
      .send();
  };

  //@desc create order by userId
  //@route POST /api/order/user/:userId/createOrder
  //@access private
  createOrder = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId } = req.params;
    const { addressId, paymentMethod } = req.body;

    if (userId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    const cart = await CartService.findOne({ userId });

    if (!cart) {
      throw new HttpError(404, "Cart empty!");
    }

    const listings = [];
    for (const product of cart.products) {
      listings.push({
        listingId: product.productVariantId,
        listingType: "Product",
        status: "Order Placed",
      });
    }
    for (const service of cart.services) {
      listings.push({
        listingId: service.serviceId,
        listingType: "Service",
        status: "Order Placed",
      });
    }
    for (const event of cart.events) {
      listings.push({
        listingId: event.ticketId,
        listingType: "Event",
        status: "Order Placed",
      });
    }

    const order = await OrderService.create({
      userId,
      listings,
      addressId,
      totalAmount: cart.totalAmount,
      paymentMethod,
    });

    await sendNotification(userId, "Order", `Order placed!.`);

    await CartService.findByIdAndUpdate(
      { _id: cart._id },
      {
        products: [],
        services: [],
        events: [],
        offerApplied: null,
        originalTotalPrice: {},
        couponDiscountedAmount: null,
        totalAmount: 0,
      }
    );

    Logger.info("Order placed successfully");
    Response(res)
      .status(200)
      .message("Order placed successfully")
      .body({ order })
      .send();
  };

  //@desc update order
  //@route PUT /api/order/:orderId/:listingType/:listindId
  //@access private
  updateOrderStatus = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { orderId, listingType, listingId } = req.params;
    const { orderStatus } = req.body;

    if (!["Product", "Service", "Event"].includes(listingType)) {
      throw new HttpError(400, "Invalid listingType");
    }

    const order = await OrderService.findById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    let listingIndex = -1;
    for (let i = 0; i < order.listings.length; i++) {
      const listing = order.listings[i];
      if (
        listing.listingId.toString() === listingId &&
        listing.listingType === listingType
      ) {
        listingIndex = i;
        break;
      }
    }

    if (listingIndex === -1) {
      throw new HttpError(404, "Listing not found in the order");
    }

    order.listings[listingIndex].status = orderStatus;

    const updatedOrder = await order.save();

    await sendNotification(
      order.userId,
      "Order",
      `Your order is ${orderStatus}.`
    );

    Logger.info("Order status updated successfully");
    Response(res)
      .status(200)
      .message("Order status updated successfully")
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

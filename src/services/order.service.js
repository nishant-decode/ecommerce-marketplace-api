const { Order } = require("../models/order.model");
const BasicServices = require("./basic.service");

class OrderService extends BasicServices {
  constructor() {
    super(Order);
  }
}

module.exports.OrderService = new OrderService();

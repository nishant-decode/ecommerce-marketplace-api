const { Cart } = require("../models/cart.model");
const BasicServices = require("./basic.service");

class CartService extends BasicServices {
  constructor() {
    super(Cart);
  }
}

module.exports.CartService = new CartService();
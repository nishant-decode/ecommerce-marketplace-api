const { Seller } = require("../models/seller.model");
const BasicServices = require("./basic.service");

class SellerService extends BasicServices {
  constructor() {
    super(Seller);
  }
}

module.exports.SellerService = new SellerService();

const { Product } = require("../models/product.model");
const BasicServices = require("./basic.service");

class ProductService extends BasicServices {
  constructor() {
    super(Product);
  }
}

module.exports.ProductService = new ProductService();

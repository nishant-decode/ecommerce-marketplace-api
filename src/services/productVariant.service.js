const { ProductVariant } = require("../models/productVariant.model");
const BasicServices = require("./basic.service");

class ProductVariantService extends BasicServices {
  constructor() {
    super(ProductVariant);
  }
}

module.exports.ProductVariantService = new ProductVariantService();
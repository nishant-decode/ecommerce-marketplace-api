const { Address } = require("../models/address.model");
const BasicServices = require("./basic.service");

class AddressService extends BasicServices {
  constructor() {
    super(Address);
  }
}

module.exports.AddressService = new AddressService();
const { Store } = require("../models/store.model");
const BasicServices = require("./basic.service");

class StoreService extends BasicServices {
  constructor() {
    super(Store);
  }
}

module.exports.StoreService = new StoreService();

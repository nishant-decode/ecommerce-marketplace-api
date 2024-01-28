const { Service } = require("../models/service.model");
const BasicServices = require("./basic.service");

class ServiceService extends BasicServices {
  constructor() {
    super(Service);
  }
}

module.exports.ServiceService = new ServiceService();

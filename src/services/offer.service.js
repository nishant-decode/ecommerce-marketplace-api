const { Offer } = require("../models/offer.model");
const BasicServices = require("./basic.service");

class OfferService extends BasicServices {
  constructor() {
    super(Offer);
  }
}

module.exports.OfferService = new OfferService();
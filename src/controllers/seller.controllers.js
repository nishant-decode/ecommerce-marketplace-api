const { SellerService } = require("../services/seller.service");
const BasicUserController = require("./basicUser.controllers");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class SellerController extends BasicUserController {
  constructor() {
    super(SellerService);
  }
}

module.exports.SellerController = new SellerController();
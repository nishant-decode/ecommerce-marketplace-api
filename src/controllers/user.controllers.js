const { UserService } = require("../services/user.service");
const BasicUserController = require("./basicUser.controllers");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class UserController extends BasicUserController {
  constructor() {
    super(UserService);
  }
}

module.exports.UserController = new UserController();
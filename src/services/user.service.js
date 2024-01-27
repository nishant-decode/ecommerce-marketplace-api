const { User } = require("../models/user.model");
const BasicServices = require("./basic.service");

class UserService extends BasicServices {
  constructor() {
    super(User);
  }
}

module.exports.UserService = new UserService();

const { Follow } = require("../models/follow.model");
const BasicServices = require("./basic.service");

class FollowService extends BasicServices {
  constructor() {
    super(Follow);
  }
}

module.exports.FollowService = new FollowService();
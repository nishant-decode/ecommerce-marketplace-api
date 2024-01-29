const { Newsfeed } = require("../models/newsfeed.model");
const BasicServices = require("./basic.service");

class NewsfeedService extends BasicServices {
  constructor() {
    super(Newsfeed);
  }
}

module.exports.NewsfeedService = new NewsfeedService();

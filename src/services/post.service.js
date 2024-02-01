const { Post } = require("../models/post.model");
const BasicServices = require("./basic.service");

class PostService extends BasicServices {
  constructor() {
    super(Newsfeed);
  }
}

module.exports.PostService = new PostService();

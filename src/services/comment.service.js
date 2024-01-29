const { Comment } = require("../models/comment.model");
const BasicServices = require("./basic.service");

class CommentService extends BasicServices {
  constructor() {
    super(Comment);
  }
}

module.exports.CommentService = new CommentService();

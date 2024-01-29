const { Review } = require("../models/review.model");
const BasicServices = require("./basic.service");

class ReviewService extends BasicServices {
  constructor() {
    super(Review);
  }
}

module.exports.ReviewService = new ReviewService();

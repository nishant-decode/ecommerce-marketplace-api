const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { ReviewService } = require("../services/review.service");
const { UserService } = require("../services/user.service");
const { ProductService } = require("../services/product.service");
const { ServiceService } = require("../services/service.service");
const { EventService } = require("../services/event.service");

class ReviewController {
  //@desc get all reviews
  //@route GET /api/review/
  //@access public
  getAllReviews = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query;

    const reviews = await ReviewService.find(filters);

    Logger.info(`All Reviews: ${reviews}`);
    Response(res).status(200).message("All Reviews").body(reviews).send();
  };

  //@desc get review by reviewId
  //@route GET /api/review/:reviewId
  //@access public
  getReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reviewId } = req.params;

    const review = await ReviewService.findById(reviewId);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    Logger.info(`Review by reviewId: ${review}`);
    Response(res).status(200).message("Review by reviewId").body(review).send();
  };

  //@desc get review by search query
  //@route GET /api/review/search
  //@access public
  searchReviews = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query;

    const reviews = await ReviewService.search(filters); //implement

    Logger.info(`Reviews found by search query: ${reviews}`);
    Response(res)
      .status(200)
      .message("Reviews found by search query")
      .body(reviews)
      .send();
  };

  //@desc add a review by userId
  //@route POST /api/review/user/:userId/addReview
  //@access private
  addReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.userId;

    if (!req.body.title || !req.body.description || !req.body.rating) {
      throw new HttpError(400, "All fields mandatory");
    }

    // Validate user and listing
    const user = await UserService.findById(userId);

    if (!user || user._id.toString() != req.user._id.toString()) {
      throw new HttpError(404, "User not found");
    }

    for (const reviewedlisting of req.body.reviewedlistings) {
      let listing;
      switch (reviewedlisting.listingType) {
        case "Product":
          listing = await ProductService.findById(reviewedlisting.listingId);
          break;
        case "Service":
          listing = await ServiceService.findById(reviewedlisting.listingId);
          break;
        case "Event":
          listing = await EventService.findById(reviewedlisting.listingId);
          break;
        default:
          throw new HttpError(400, "Invalid listing type");
      }
      if (!listing) {
        throw new HttpError(404, `${listingType} not found`);
      }
    }

    // Create a new review
    const review = await ReviewService.create({
      userId,
      ...req.body,
    });

    Logger.info(`Review added successfully: ${review}`);
    Response(res).status(201).message("Review added successfully").send();
  };

  //@desc like review
  //@route POST /api/review/:reviewId/user/:userId/like
  //@access private
  likeReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await ReviewService.findById(reviewId);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    if (review.likes.includes(userId)) {
      throw new HttpError(400, "You have already liked this review");
    }

    review.likes.push(userId);
    const updatedReview = await review.save();

    Logger.info(`Review liked by user: ${updatedReview}`);
    Response(res).status(200).message("Review liked successfully").send();
  };

  //@desc update review by reviewId
  //@route PUT /api/review/:reviewId
  //@access private
  updateReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reviewId } = req.params;
    const updateData = req.body;

    const review = await ReviewService.findById(reviewId);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    if (!(user._id.toString() === review.userId.toString())) {
      throw new HttpError(403, "Unauthorized to update this review");
    }

    const updatedReview = await ReviewService.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true } // Return the updated document
    );

    Logger.info(`Review updated: ${updatedReview}`);
    Response(res)
      .status(200)
      .message("Review updated successfully")
      .body(updatedReview)
      .send();
  };

  //@desc unlike review by userId
  //@route DELETE /api/review/:reviewId/user/:userId/unlike
  //@access private
  unlikeReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await ReviewService.findById(reviewId);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    if (!review.likes.includes(userId)) {
      throw new HttpError(400, "You haven't liked this review");
    }

    review.likes.pull(userId);
    const updatedReview = await review.save();

    Logger.info(`Review unliked by user: ${updatedReview}`);
    Response(res).status(200).message("Review unliked successfully").send();
  };

  //@desc delete review by reviewId
  //@route PUT /api/review/:reviewId
  //@access private
  deleteReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reviewId } = req.params;

    const review = await ReviewService.findById(reviewId);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    if (!(user._id.toString() === review.userId.toString())) {
      throw new HttpError(403, "Unauthorized to delete this review");
    }

    await ReviewService.findByIdAndDelete(reviewId);

    Logger.info(`Review deleted by reviewId: ${reviewId}`);
    Response(res).status(200).message("Review deleted successfully").send();
  };
}

module.exports.ReviewController = new ReviewController();

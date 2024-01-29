const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { ReviewService } = require("../services/review.service");
const { UserService } = require("../services/user.service");
const { ProductService } = require("../services/product.service");
const { ServiceService } = require("../services/service.service");
const { EventService } = require("../services/event.service");

class ReviewsController {
  addReview = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;

    const { listingType, listingId } = req.body;

    // Validate user and listing
    const user = await UserService.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    let listing;
    switch (listingType) {
      case "Product":
        listing = await ProductService.find({ _id: { $in: listingId } });
        break;
      case "Service":
        listing = await ServiceService.find({ _id: { $in: listingId } });
        break;
      case "Event":
        listing = await EventService.find({ _id: { $in: listingId } });
        break;
      default:
        throw new HttpError(400, "Invalid listing type");
    }

    if (!listing) {
      throw new HttpError(404, `${listingType} not found`);
    }

    // Create a new review
    const review = await ReviewService.create({
      ...req.body,
      listings: [listingId],
    });

    // Update the user's reviews
    user.reviews.push(review._id);
    await user.save();

    for (const listItem of listing) {
      switch (listItem.listingType) {
        case "Product":
        case "Service":
        case "Event":
          listItem.reviews.push(review._id);
          await listItem.save();
          break;
      }
    }

    Logger.info(`Review added successfully: ${review}`);
    Response(res).status(201).message("Review added successfully").send();
  };
}

module.exports.ReviewsController = new ReviewsController();
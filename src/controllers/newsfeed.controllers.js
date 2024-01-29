const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { NewsfeedService } = require("../services/newsfeed.service");
const { SellerService } = require("../services/seller.service");

class NewsfeedController {
  addPost = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const sellerId = req.params.id;

    // Fetch seller
    const seller = await SellerService.findById(sellerId);

    // Validate seller
    if (!seller) {
      throw new HttpError(404, "Seller not found");
    }

    const { content, url, listing, listingId } = req.body;

    // Create a new post
    const post = await NewsfeedService.create({
      sellerId,
      content,
      url,
      listing,
      listingId,
    });

    // Add post to seller's newsfeed
    seller.newsfeed.push(post._id);
    await seller.save();

    Logger.info(`Post added successfully: ${post}`);
    Response(res).status(201).message("Post added successfully:").body({post}).send();
  };
}

module.exports.NewsfeedController = new NewsfeedController();
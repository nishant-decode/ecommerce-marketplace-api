const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { StoreService } = require("../services/store.service");
const { ProductService } = require("../services/product.service");
const { ServiceService } = require("../services/service.service");
const { EventService } = require("../services/event.service");
const { PostService } = require("../services/post.service");

class PostController {
  //@desc get all posts
  //@route GET /api/post/
  //@access public
  getAllPosts = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const posts = await PostService.find({});
    Logger.info(`All posts:`);
    Response(res)
      .status(200)
      .message("All posts")
      .body(posts)
      .send();
  };

  //@desc get all posts
  //@route GET /api/post/:postId
  //@access public
  getPost = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const post = await PostService.findById(req.params.postId);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    Logger.info(`Post:`);
    Response(res)
      .status(200)
      .message("Post")
      .body(post)
      .send();
  };

  //@desc create a post by sellerId
  //@route POST /api/post/store/:storeId/createPost
  //@access private
  createPost = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const storeId = req.params.storeId;

    // Fetch seller
    const store = await StoreService.findById(storeId);

    // Validate seller
    if (!store) {
      throw new HttpError(404, "Store not found");
    }

    const { content, url, listings } = req.body;

    const isValidListingIds = await Promise.all(listings.map(async (listing) => {
      const { listingType, listingId } = listing;

      switch (listingType) {
        case 'product':
          return await ProductService.exists({ _id: listingId });
        case 'service':
          return await ServiceService.exists({ _id: listingId });
        case 'event':
          return await EventService.exists({ _id: listingId });
        default:
          return false;
      }
    }));

    if (!isValidListingIds.every(Boolean)) {
      throw new HttpError(400, "Invalid listingIds. Each listingId must belong to its respective collection (product, service, or event)");
    }

    // Create a new post
    const post = await PostService.create({
      storeId,
      content,
      url,
      listings
    });

    Logger.info(`Post added successfully: ${post}`);
    Response(res).status(201).message("Post added successfully:").body({post}).send();
  };

  //@desc update posts
  //@route PUT /api/post/:postId
  //@access private
  updatePost = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { postId } = req.params;

    const { content, url, listings } = req.body;

    if(listings){
      const isValidListingIds = await Promise.all(
        (listings).map(async (listing) => {
          const { listingType, listingId } = listing;

          switch (listingType) {
            case "product":
              return await ProductService.exists({ _id: listingId });
            case "service":
              return await ServiceService.exists({ _id: listingId });
            case "event":
              return await EventService.exists({ _id: listingId });
            default:
              return false;
          }
        })
      );

      if (!isValidListingIds.every(Boolean)) {
        throw new HttpError(400, "Invalid listingIds. Each listingId must belong to its respective collection (product, service, or event)");
      }
    }

    // Update the post
    const updatedPost = await PostService.findByIdAndUpdate(postId, {
      content,
      url,
      listings,
    });

    Logger.info(`Post updated`);
    Response(res)
      .status(200)
      .message("Post updated")
      .body()
      .send();
  };

  //@desc delete posts
  //@route DELETE /api/post/:postId
  //@access private
  deletePost = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { postId } = req.params;

    // Check if the post exists
    const existingPost = await PostService.findById(postId);

    if (!existingPost) {
      throw new HttpError(404, "Post not found");
    }

    // Delete the post
    await PostService.findByIdAndDelete(postId);

    Logger.info(`Post deleted: ${postId}`);
    Response(res)
      .status(200)
      .message("Post deleted")
      .body()
      .send();
  };
}

module.exports.PostController = new PostController();
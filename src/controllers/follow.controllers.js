const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { FollowService } = require("../services/follow.service");

class FollowController {
  //@desc get all store followers
  //@route GET /store/:storeId
  //@access public
  getAllStoreFollowers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
  
    const storeId = req.params.storeId;

    const followers = await FollowService.find({ storeId });

    Logger.info(`All store followers:`);
    Response(res)
      .status(200)
      .message("All store followers")
      .body(followers)
      .send();
  };

  //@desc follow a store
  //@route POST /store/:storeId
  //@access private
  followStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;
    const { userId } = req.user._id;

    const existingFollow = await FollowService.findOne({ storeId, userId });
    if (existingFollow) {
      return HttpError(res, 400, "Already following the store");
    }

    await FollowService.create({ storeId, userId });
    Logger.info(`Store followed:`);
    Response(res)
      .status(200)
      .message("Store followed")
      .body()
      .send();
  };

  //@desc unfollow a store
  //@route DELETE /store/:storeId
  //@access private
  unfollowStore = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;
    const { userId } = req.user._id;

    await FollowService.findOneAndDelete({ storeId, userId });

    Logger.info(`Store unfollowed:`);
    Response(res)
      .status(200)
      .message("Store unfollowed")
      .body()
      .send();
  };

}

module.exports.FollowController = new FollowController();
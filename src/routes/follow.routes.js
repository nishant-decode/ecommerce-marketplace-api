const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require("../middlewares/access.middlewares");
const { FollowController } = require("../controllers/follow.controllers");

const router = express.Router();

//get requests
router.get("/store/:storeId", FollowController.getAllStoreFollowers);

//post requests
router.post(
  "/store/:storeId",
  [Auth, access("Buyer")],
  FollowController.followStore
);

//delete requests
router.delete(
  "/store/:storeId",
  [Auth, access("Buyer")],
  FollowController.unfollowStore
);

module.exports.FollowRouter = router;

const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { ReviewController } = require("../controllers/review.controllers");

const router = express.Router();

//get requests
router.get("/", ReviewController.getAllReviews);
router.get("/:reviewId", ReviewController.getReview);
router.get("/search", ReviewController.searchReviews);

//post requests
router.post("/user/:userId/addReview", [Auth, access('Buyer')], ReviewController.addReview);
router.post("/:reviewId/user/:userId/like", [Auth, access('Buyer')], ReviewController.likeReview);

//put requests
router.put("/:reviewId", [Auth, access('Buyer','Admin')], ReviewController.updateReview);

//delete requests
router.delete("/:reviewId/user/:userId/unlike", [Auth, access('Buyer')], ReviewController.unlikeReview);
router.delete("/:reviewId", [Auth, access('Buyer','Admin')], ReviewController.deleteReview);

module.exports.ReviewRouter = router;
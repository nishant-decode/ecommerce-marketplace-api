const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { CommentController } = require("../controllers/comment.controllers");

const router = express.Router();

//get requests
router.get("/:category/:categoryId", CommentController.getComments);

//post requests
router.post("/:commentId/like", [Auth, access('Buyer')], CommentController.likeComment);
router.post("/:category/:categoryId", [Auth, access('Buyer')], CommentController.addComment);

//put requests
router.put("/:commentId", [Auth, access('Buyer','Admin')], CommentController.updateComment);

//delete requests
router.delete("/:commentId/unlike", [Auth, access('Buyer')], CommentController.unlikeComment);
router.delete("/:commentId", [Auth, access('Buyer','Admin')], CommentController.deleteComment);

module.exports.CommentRouter = router;
const { CommentService } = require("../services/comment.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");
const { sendNotification } = require("../helpers/notification.helper");
const { ReviewService } = require("../services/review.service");

class CommentController {
  //@desc get comments by category
  //@route GET /:category/:categoryId
  //@access public
  getComments = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, categoryId } = req.params;

    // Retrieve comments by category logic
    const comments = await CommentService.find({ category, categoryId });

    Logger.info(`All comments by category:`);
    Response(res)
      .status(200)
      .message("All comments by category")
      .body(comments)
      .send();
  };

  //@desc like a comment by commentId
  //@route GET /:commentId/like
  //@access private
  likeComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;

    // Like a comment logic
    const comment = await CommentService.findById(commentId);

    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(req.user._id)) {
      throw new HttpError(400, "You have already liked this comment");
    }

    // Add user to the likes array
    comment.likes.push(req.user._id);
    await comment.save();

    await sendNotification(
      comment.userId,
      "Comment",
      `${req.user.name.first} liked your comment ${comment.content}.`
    );

    Logger.info(`Comment liked:`);
    Response(res).status(200).message("Comment liked").body().send();
  };

  //@desc add a comment
  //@route POST /:category/:categoryId
  //@access private
  addComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, categoryId } = req.params;
    const { content } = req.body;

    // Create the comment
    const comment = await CommentService.create({
      userId: req.user._id,
      content,
      category,
      categoryId,
    });

    if (category == "Review") {
      const user = await ReviewService.findById(categoryId).userId;
      await sendNotification(
        user.userId,
        "Comment",
        `${req.user.name.first} commented on your ${category}.`
      );
    } else if (category == "Comment") {
      const user = await CommentService.findById(categoryId).userId;
      await sendNotification(
        user.userId,
        "Comment",
        `${req.user.name.first} replied to your ${category}.`
      );
    }

    Logger.info("Comment added successfully");
    Response(res).status(201).body({ comment }).send();
  };

  //@desc update comment by commentId
  //@route PUT /:commentId
  //@access private
  updateComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;
    const updateData = req.body;

    // Update comment logic
    const comment = await CommentService.findById(commentId);
    if (!comment) {
      throw new HttpError(404, "Comment not found!");
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(comment, updateData);

    const updatedComment = await comment.save();

    Logger.info(`Comment updated:`);
    Response(res)
      .status(200)
      .message("Comment updated")
      .body(updatedComment)
      .send();
  };

  //@desc unlike a comment
  //@route DELETE /:commentId/unlike
  //@access private
  unlikeComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;

    // Unlike a comment logic
    const comment = await CommentService.findById(commentId);

    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }

    // Check if the user has liked the comment
    if (!comment.likes.includes(req.user._id)) {
      throw new HttpError(400, "You have not liked this comment");
    }

    // Remove user from the likes array
    comment.likes = comment.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await comment.save();

    Logger.info(`Comment unliked:`);
    Response(res).status(200).message("Comment unliked").body().send();
  };

  //@desc delete comment by commentId
  //@route DELETE /:commentId
  //@access private
  deleteComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;

    const comment = await CommentService.findById(commentId);
    if (!comment) {
      throw new HttpError(404, "Comment not found!");
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Delete comment logic
    await CommentService.findByIdAndDelete(commentId);

    Logger.info(`Comment deleted:`);
    Response(res).status(200).message("Comment deleted").body().send();
  };
}

module.exports.CommentController = new CommentController();

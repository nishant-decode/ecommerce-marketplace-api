const { CommentService } = require("../services/comment.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

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

    Logger.info(`Comment liked:`);
    Response(res)
      .status(200)
      .message("Comment liked")
      .body()
      .send();
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
      categoryId
    });

    Logger.info("Comment added successfully");
    Response(res).status(201).body({ comment }).send();
  }

  //@desc update comment by commentId
  //@route PUT /:commentId
  //@access private
  updateComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;
    const { content } = req.body;

    // Update comment logic
    const updatedComment = await CommentService.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

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
    comment.likes = comment.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    await comment.save();

    Logger.info(`Comment unliked:`);
    Response(res)
      .status(200)
      .message("Comment unliked")
      .body()
      .send();
  };

  //@desc delete comment by commentId
  //@route DELETE /:commentId
  //@access private
  deleteComment = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { commentId } = req.params;

    // Delete comment logic
    await CommentService.findByIdAndDelete(commentId);

    Logger.info(`Comment deleted:`);
    Response(res)
      .status(200)
      .message("Comment deleted")
      .body()
      .send();
  };
}

module.exports.CommentController = new CommentController();

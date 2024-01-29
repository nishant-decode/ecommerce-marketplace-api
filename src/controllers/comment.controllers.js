const { CommentService } = require("../services/comment.service");
const { ReviewService } = require("../services/review.service");
const { NewsfeedService } = require("../services/newsfeed.service");
const { UserService } = require("../services/user.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class CommentController {
  async addComment(req, res) {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.id;

    const { content, parentType, parentId } = req.body;

    // Validate user
    const user = await UserService.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Create the comment
    const comment = await CommentService.create({
      user: userId,
      content,
    });

    // Add comment to the parent based on the type
    let parent;
    switch (parentType) {
      case "Review":
        parent = await ReviewService.findById(parentId);
        if (!parent) {
          throw new HttpError(404, "Review not found");
        }
        parent.comments.push(comment);
        break;
      case "Newsfeed":
        parent = await NewsfeedService.findById(parentId);
        if (!parent) {
          throw new HttpError(404, "Newsfeed not found");
        }
        parent.comments.push(comment);
        break;
      case "Comment":
        parent = await CommentService.findById(parentId);
        if (!parent) {
          throw new HttpError(404, "Parent comment not found");
        }
        parent.replies.push(comment);
        break;
      default:
        throw new HttpError(400, "Invalid parent type");
    }

    await parent.save();

    Logger.info("Comment added successfully");
    Response(res).status(201).body({ comment }).send();
  }
}

module.exports.CommentController = new CommentController();

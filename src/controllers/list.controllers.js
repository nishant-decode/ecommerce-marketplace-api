const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { ListService } = require("../services/list.service");

class ListController {
  //@desc get all lists
  //@route GET /api/list/
  //@access public
  getAllLists = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const lists = await ListService.find({});

    Logger.info(`All lists: ${lists}`);
    Response(res).status(200).message("All lists").body(lists).send();
  };

  //@desc get list
  //@route GET /api/list/:listId
  //@access public
  getList = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const list = await ListService.findById(req.params.listId);

    if (!list) {
      return HttpError(res, 404, "List not found");
    }

    Logger.info(`List: ${list}`);
    Response(res).status(200).message("List").body(list).send();
  };

  //@desc search lists by search query
  //@route GET /api/list/creator/:creatorId
  //@access public
  searchLists = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { creatorId } = req.params;

    // Find lists using the filter
    const lists = await ListService.find({ creatorId });

    Logger.info(`Lists found by search query: ${lists}`);
    Response(res)
      .status(200)
      .message("Lists found by search query")
      .body(lists)
      .send();
  };

  //@desc create list by userId
  //@route POST /api/list/user/:userId/create
  //@access private
  createList = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name, status, listings, description, keywords } = req.body;

    if (!name || !status || !listings || !description || !keywords) {
      Logger.error("Invalid request body");
      return Response(res).status(400).message("Invalid request body").send();
    }

    if (req.params.userId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    const newList = await ListService.create({
      name,
      creatorId: req.params.userId,
      status,
      listings,
      description,
      keywords,
    });

    Logger.info(`List created:`);
    Response(res).status(200).message("List created").body({ newList }).send();
  };

  //@desc update list
  //@route PUT /api/list/:listId
  //@access private
  updateList = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const list = await ListService.findById(req.params.listId);

    if (
      list.creatorId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(list, req.body);

    const updatedList = await list.save();

    if (!updatedList) {
      return HttpError(res, 404, "List not found");
    }

    Logger.info(`List updated: ${updatedList}`);
    Response(res).status(200).message("List updated").body(updatedList).send();
  };

  //@desc delete list
  //@route DELETE /api/list/:listId
  //@access private
  deleteList = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const list = await ListService.findById(req.params.listId);

    if (
      list.creatorId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedList = await ListService.findByIdAndDelete(req.params.listId);

    if (!deletedList) {
      return HttpError(res, 404, "List not found");
    }

    Logger.info(`List deleted: ${deletedList}`);
    Response(res).status(200).message("List deleted").body(deletedList).send();
  };
}

module.exports.ListController = new ListController();

const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require("../middlewares/access.middlewares");
const { ListController } = require("../controllers/list.controllers");

const router = express.Router();

//get requests
router.get("/", ListController.getAllLists);
router.get("/:listId", ListController.getList);
router.get("/creator/:creatorId", ListController.searchLists);

//post requests
router.post(
  "/user/:userId/create",
  [Auth, access("Buyer", "Seller")],
  ListController.createList
);

//put requests
router.put("/:listId", [Auth], ListController.updateList);

//delete requests
router.delete("/:listId", [Auth], ListController.deleteList);

module.exports.ListRouter = router;

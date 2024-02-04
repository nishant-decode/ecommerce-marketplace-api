const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { PostController } = require("../controllers/post.controllers");

const router = express.Router();

//get requests
router.get("/", PostController.getAllPosts);
router.get("/:postId", PostController.getPost);

//post requests
router.post("/store/:storeId/createPost", [Auth, access('Seller')], PostController.createPost);

//put requests
router.put("/:postId", [Auth, access('Seller','Admin')], PostController.updatePost);

//delete requests
router.delete("/:postId", [Auth, access('Seller','Admin')], PostController.deletePost);

module.exports.PostRouter = router;
const express = require("express");
const { SellerController } = require("../controllers/seller.controllers");
const { ProductController } = require("../controllers/product.controllers");
const { ServiceController } = require("../controllers/service.controllers");
const { EventController } = require("../controllers/event.controllers");
const { NewsfeedController } = require("../controllers/newsfeed.controllers");
const { SellerAuth } = require("../middlewares/sellerAuth.middlewares");
const router = express.Router();

//get requests
router.get("/",SellerAuth,SellerController.getAllUsers)
router.get("/:id",SellerAuth,SellerController.getUser)

//post requests
router.post("/register", SellerController.register);
router.post("/sendOtp", SellerController.sendOtp);
router.post("/verifyOtp",SellerController.verifyOtp);

router.post("/login",SellerController.login);
router.post("/sendToken",SellerController.sendToken);
router.post("/verifyToken",SellerController.verifyToken);
router.post("/resetPassword",SellerAuth,SellerController.resetPassword);

router.post("/:id/products/listProduct",SellerAuth,ProductController.listProduct);
router.post("/:id/services/listService",SellerAuth,ServiceController.listService);
router.post("/:id/events/listEvent",SellerAuth,EventController.listEvent);

router.post("/:id/newsfeed/addPost",SellerAuth,NewsfeedController.addPost);

//put requests
router.put("/:id",SellerAuth,SellerController.updateUser)

//delete requests
router.delete("/:id",SellerAuth,SellerController.deleteUser)

//patch requests
router.patch("/:id",SellerAuth,SellerController.createStore)

//customScripts

module.exports.SellerRouter = router;
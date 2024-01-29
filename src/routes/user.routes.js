const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const { UserController } = require("../controllers/user.controllers");
const { CheckoutController } = require("../controllers/checkout.controller");
const { ReviewsController } = require('../controllers/review.controllers');
const { CommentController } = require('../controllers/comment.controllers');

const router = express.Router();

//get requests
router.get("/",Auth,UserController.getAllUsers)
router.get("/:id",Auth,UserController.getUser)

router.get("/:id/cart", Auth, UserController.getAllCartItems);

router.get("/:id/calculateTotal",Auth,CheckoutController.calculateTotalAmount);

//post requests
router.post("/register",UserController.register);
router.post("/sendOtp",UserController.sendOtp);
router.post("/verifyOtp",UserController.verifyOtp);

router.post("/login",UserController.login);
router.post("/sendToken",UserController.sendToken);
router.post("/verifyToken",UserController.verifyToken);
router.post("/resetPassword",Auth,UserController.resetPassword);

router.post("/:id/cart",Auth,UserController.addToCart);
router.post("/:id/checkout",Auth,CheckoutController.checkout);

router.post('/:id/reviews/addReview',Auth,ReviewsController.addReview);

router.post('/:id/comments/addComment',Auth,CommentController.addComment);

//put requests
router.put("/:id",Auth,UserController.updateUser)

//delete requests
router.delete("/:id",Auth,UserController.deleteUser)

router.delete("/:id/cart",Auth,UserController.deleteCartItem);

//customScripts

module.exports.UserRouter = router;
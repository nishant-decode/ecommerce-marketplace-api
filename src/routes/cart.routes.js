const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const { access } = require('../middlewares/access.middlewares');
const { CartController } = require("../controllers/cart.controllers");

const router = express.Router();

//get requests
router.get("/:cartId", [Auth, access(['Buyer','Admin'])], UserController.getCart);

//post requests
router.post("/user/:userId/:itemType/:itemId/", [Auth, access(['Buyer'])], CartController.addToCart);

//put requests
router.put("/:cartId/:itemType/:itemId", [Auth, access(['Buyer','Admin'])], CartController.updateCart);

//delete requests
router.delete("/:cartId/:itemType/:itemId", [Auth, access(['Buyer','Admin'])], CartController.removeCartItem);
router.delete("/:cartId", [Auth, access(['Admin'])], CartController.deleteCart);
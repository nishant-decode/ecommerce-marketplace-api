const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { OrderController } = require("../controllers/order.controllers");

const router = express.Router();

//get requests
router.get("/", [Auth, access('Admin')], OrderController.getAllOrders);
router.get("/:orderId", [Auth, access('Admin')], OrderController.getOrder);
router.get("/search", [Auth, access('Admin')], OrderController.searchAllOrders);

router.get("/store/:storeId/", [Auth, access('Seller','Admin')], OrderController.getAllStoreOrders);
router.get("/:orderId/store/:storeId/", [Auth, access('Seller','Admin')], OrderController.getStoreOrder);
router.get("/store/:storeId/search", [Auth, access('Seller','Admin')], OrderController.searchStoreOrders);

router.get("/user/:userId/", [Auth, access('Buyer','Admin')], OrderController.getAllUserOrders);
router.get("/:orderId/user/:userId", [Auth, access('Buyer','Admin')], OrderController.getUserOrder);
router.get("/user/:userId/search", [Auth, access('Buyer','Admin')], OrderController.searchUserOrders);

//post requests
router.post("/user/:userId/createOrder", [Auth, access('Buyer')], OrderController.createOrder);

//put requests
router.put("/:orderId", [Auth, access('Seller','Admin')], OrderController.updateOrderStatus);

//delete requests
router.delete("/:orderId", [Auth, access('Admin')], OrderController.deleteOrder);

module.exports.OrderRouter = router;
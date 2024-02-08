const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require("../middlewares/access.middlewares");
const { StoreController } = require("../controllers/store.controllers");

const router = express.Router();

//get requests
router.get("/", StoreController.getAllStores);
router.get("/:storeId", StoreController.getStore);

//post requests
router.post(
  "/seller/:sellerId/create",
  [Auth, access("Seller")],
  StoreController.createStore
);

//put requests
router.put(
  "/:storeId",
  [Auth, access("Seller", "Admin")],
  StoreController.updateStore
);

//delete requests
router.delete(
  "/:storeId",
  [Auth, access("Admin")],
  StoreController.deleteStore
);

module.exports.StoreRouter = router;

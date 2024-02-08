const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require("../middlewares/access.middlewares");
const { ServiceController } = require("../controllers/service.controllers");

const router = express.Router();

//get requests
router.get("/", ServiceController.getAllServices);
router.get("/search", ServiceController.searchServices);
router.get("/:serviceId", ServiceController.getService);

//post requests
router.post(
  "/store/:storeId/listService",
  [Auth, access("Seller")],
  ServiceController.listService
);

//put requests
router.put(
  "/:serviceId",
  [Auth, access("Seller", "Admin")],
  ServiceController.updateService
);

//delete requests
router.delete(
  "/:serviceId",
  [Auth, access("Seller", "Admin")],
  ServiceController.deleteService
);

module.exports.ServiceRouter = router;

const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { OfferController } = require("../controllers/offer.controllers");

const router = express.Router();

//get requests
router.get("/", OfferController.getAllOffers);
router.get("search", OfferController.searchOffers);
router.get("/:offerId", OfferController.getOffer);

//post requests
router.post("/store/:storeId/create", [Auth, access('Seller')], OfferController.createOffer);
router.post("/:offerId/cart/:cartId", [Auth, access('Buyer')], OfferController.addOffer);

//put requests
router.put("/:offerId", [Auth, access('Seller','Admin')], OfferController.updateOffer);

//delete requests
router.delete("/:offerId", [Auth, access('Seller','Admin')], OfferController.deleteOffer);

module.exports.OfferRouter = router;
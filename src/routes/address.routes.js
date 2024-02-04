const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { AddressController } = require("../controllers/address.controllers");

const router = express.Router();

//get requests
router.get("/",[Auth, access('Admin')], AddressController.getAllAddresses);
router.get("/:addressId", [Auth, access('Buyer','Seller')], AddressController.getAddress);

//post requests
router.post("/user/:userId/create", [Auth, access('Buyer','Seller')], AddressController.createAddress);

//put requests
router.put("/:addressId", [Auth, access('Buyer','Seller','Admin')], AddressController.updateAddress);
router.put("/:addressId/default", [Auth, access('Buyer','Seller')], AddressController.setDefaultAddress);

//delete requests
router.delete("/:addressId", [Auth, access('Buyer','Seller','Admin')], AddressController.deleteAddress);

module.exports.AddressRouter = router;
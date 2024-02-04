const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { ProductVariantController } = require("../controllers/productVariant.controllers");

const router = express.Router();

//get requests
router.get("/", [Auth, access('Admin')], ProductVariantController.getAllVariants);
router.get("/:variantId", ProductVariantController.getVariant);
router.get("/product/:productId", ProductVariantController.getProductVariants);
router.get("/search", ProductVariantController.searchAttributes);

//post requests
router.post("/product/:productId/addVariant", [Auth, access('Seller')], ProductVariantController.addVariant);

//put requests
router.put("/:variantId", [Auth, access('Seller','Admin')], ProductVariantController.updateVariant);

//delete requests
router.delete("/:variantId", [Auth, access('Seller','Admin')], ProductVariantController.deleteVariant);

module.exports.ProductVariantRouter = router;
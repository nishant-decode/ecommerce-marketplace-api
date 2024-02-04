const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { ProductController } = require("../controllers/product.controllers");

const router = express.Router();

//get requests
router.get("/",ProductController.getAllProducts);
router.get("/:productId",ProductController.getProduct);
router.get("/search",ProductController.searchProducts); // /api/products/search?categories[]=Electronics&categories[]=Clothing&departments[]=Appliances&departments[]=Fashion&departments[]=Home&sellerIds[]=123&sellerIds[]=456&variantIds[]=789&variantIds[]=012&variantAttributes[]=Color:Red&variantAttributes[]=Size:Medium&minPrice=50&maxPrice=200&minRating=4

//post requests
router.post("/store/:storeId/listProduct", [Auth, access('Seller')],ProductController.listProduct);

//put requests
router.put("/:productId", [Auth, access('Seller','Admin')],ProductController.updateProduct);

//delete requests
router.delete("/:productId", [Auth, access('Seller','Admin')],ProductController.deleteProduct);

module.exports.ProductRouter = router;
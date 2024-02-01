const express = require("express");
const { ProductController } = require("../controllers/product.controllers");
const { SellerAuth } = require("../middlewares/sellerAuth.middlewares");
const router = express.Router();

//get requests
router.get("/",ProductController.getAllProducts);
router.get("/:productId",ProductController.getProduct);
router.get("/search",ProductController.getProductsBySearch); // /api/products/search?categories[]=Electronics&categories[]=Clothing&departments[]=Appliances&departments[]=Fashion&departments[]=Home&sellerIds[]=123&sellerIds[]=456&variantIds[]=789&variantIds[]=012&variantAttributes[]=Color:Red&variantAttributes[]=Size:Medium&minPrice=50&maxPrice=200&minRating=4

//post requests
router.post("/:sellerId/listProduct",SellerAuth,ProductController.listProduct);

//put requests
router.put("/:sellerId/updateProduct/:productId",SellerAuth,ProductController.updateProduct);

//delete requests
router.delete("/:sellerId/deleteProduct/:productId",SellerAuth,ProductController.deleteProduct);

//customScripts

module.exports.SellerRouter = router;
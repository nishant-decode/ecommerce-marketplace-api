const express = require("express");
const { SellerController } = require("../controllers/seller.controllers");
const { Auth } = require("../middlewares/auth.middlewares");
const router = express.Router();

//get requests
router.get("/",Auth,SellerController.getAllUsers)
router.get("/:id",Auth,SellerController.getUser)

//post requests
router.post("/register", SellerController.register);
router.post("/sendOtp", SellerController.sendOtp);
router.post("/verifyOtp",SellerController.verifyOtp);

router.post("/login",SellerController.login);
router.post("/sendToken",SellerController.sendToken);
router.post("/verifyToken",SellerController.verifyToken);
router.post("/resetPassword",Auth,SellerController.resetPassword);

//put requests
router.put("/:id",Auth,SellerController.updateUser)

//delete requests
router.delete("/:id",Auth,SellerController.deleteUser)

//customScripts

module.exports.SellerRouter = router;
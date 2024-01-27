const express = require("express");
const { UserController } = require("../controllers/user.controllers");
const { Auth } = require("../middlewares/auth.middlewares");
const router = express.Router();

//get requests
router.get("/",Auth,UserController.getAllUsers)
router.get("/:id",Auth,UserController.getUser)

//post requests
router.post("/register", UserController.register);
router.post("/sendOtp", UserController.sendOtp);
router.post("/verifyOtp",UserController.verifyOtp);

router.post("/login",UserController.login);
router.post("/sendToken",UserController.sendToken);
router.post("/verifyToken",UserController.verifyToken);
router.post("/resetPassword",Auth,UserController.resetPassword);

//put requests
router.put("/:id",Auth,UserController.updateUser)

//delete requests
router.delete("/:id",Auth,UserController.deleteUser)

//customScripts

module.exports.UserRouter = router;
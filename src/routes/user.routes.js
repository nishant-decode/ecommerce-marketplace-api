const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require("../middlewares/access.middlewares");
const { UserController } = require("../controllers/user.controllers");

const router = express.Router();

//get requests
router.get("/", [Auth, access("Admin")], UserController.getAllUsers);
router.get("/:userId", [Auth], UserController.getUser);

//post requests
router.post("/register", UserController.register);
router.post("/sendOtp", UserController.sendOtp);
router.post("/verifyOtp", UserController.verifyOtp);

router.post("/login", UserController.login);
router.post("/logout", [Auth], UserController.logout);
router.post("/sendToken", UserController.sendToken);
router.post("/verifyToken", UserController.verifyToken);
router.post("/resetPassword", [Auth], UserController.resetPassword);

//put requests
router.put("/:userId", [Auth, access("Admin")], UserController.updateUser);

//delete requests
router.delete("/:userId", [Auth, access("Admin")], UserController.deleteUser);

module.exports.UserRouter = router;

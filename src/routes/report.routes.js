const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { ReportController } = require("../controllers/report.controllers");

const router = express.Router();

//get requests
router.get("/", [Auth, access('Admin')], ReportController.getAllReports);
router.get("/search", [Auth, access('Admin')], ReportController.searchReports);

//post requests
router.post("/:category/:categoryId", [Auth, access('Buyer','Seller')], ReportController.reportItem);

//delete requests
router.delete("/:reportId", [Auth, access('Admin')], ReportController.deleteReport);

module.exports.ReportRouter = router;
const { ReportService } = require("../services/report.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ReportController {
  //@desc get all reports
  //@route GET /api/report/
  //@access private
  getAllReports = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const reports = await ReportService.find({});

    Logger.info(`All reports:`);
    Response(res).status(200).message("All reports").body(reports).send();
  };

  //@desc get all reports by search query
  //@route GET /api/report/search?category=review&reason=inappropriate%20content
  //@access private
  searchReports = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, reason } = req.query;

    const searchFilter = {};

    if (category) {
      searchFilter.category = { $regex: category, $options: "i" };
    }

    if (reason) {
      searchFilter.reason = { $regex: reason, $options: "i" };
    }

    const reports = await ReportService.find(searchFilter);

    Logger.info(`Reports found by search query:`);
    Response(res)
      .status(200)
      .message("Reports found by search query")
      .body(reports)
      .send();
  };

  //@desc report a category
  //@route POST /api/report/:category/:categoryId
  //@access private
  reportItem = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, categoryId } = req.params;

    // Check if the report already exists
    const existingReport = await ReportService.findOne({
      userId: req.user._id,
      category,
      categoryId,
    });

    if (existingReport) {
      throw new HttpError(400, "Report already exists");
    }

    // Create a new report
    const newReport = await ReportService.create({
      userId: req.user._id,
      category,
      categoryId,
      reason: req.body.reason,
    });

    Logger.info(`Report registered:`);
    Response(res)
      .status(200)
      .message("Report registered")
      .body(newReport)
      .send();
  };

  //@desc delete a report
  //@route DELETE /api/report/:reportId
  //@access private
  deleteReport = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { reportId } = req.params;

    // Check if the report exists
    const existingReport = await ReportService.findById(reportId);

    if (!existingReport) {
      throw new HttpError(404, "Report not found");
    }

    // Delete the report
    await ReportService.findByIdAndDelete(reportId);

    Logger.info(`Report deleted:`);
    Response(res).status(200).message("Report deleted").body().send();
  };
}

module.exports.ReportController = new ReportController();

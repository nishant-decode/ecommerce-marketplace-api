const { Report } = require("../models/report.model");
const BasicServices = require("./basic.service");

class ReportService extends BasicServices {
  constructor() {
    super(Report);
  }
}

module.exports.ReportService = new ReportService();
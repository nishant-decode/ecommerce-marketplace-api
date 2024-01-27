const mongoose = require("mongoose");
const Logger = require("../helpers/logger.helpers");
const { DB_URI } = process.env;

module.exports = () => {
  return mongoose
    .connect(DB_URI)
    .then((res) => Logger.info("💽 Database is Connected Successfully"))
    .catch((err) => Logger.info("Please Restart Server", err));
};

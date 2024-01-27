//middlewares
const express = require("express");
const morgan = require("morgan"); // for consoling api request calls
const helmet = require("helmet"); // secures connection by adding additional header
const cors = require("cors"); // handling cors errors
const cookieParser = require('cookie-parser');
const ErrorHandler = require("../middlewares/error.middlewares"); // error handler for routes, since we will continue to next route upon request

//logger
const Logger = require("../helpers/logger.helpers");

//Routers
const { UserRouter } = require("../routes/user.routes");
const { SellerRouter } = require("../routes/seller.routes");

module.exports = (app) => {
  app.use(express.json({ limit: "9999000009mb" })); // body parser, parses request body
  app.use(express.urlencoded({ extended: true })); // parses encoded url
  app.use(cookieParser());
  app.use(morgan("tiny")); // initiating console api requests
  app.use(helmet());
  app.use(cors());

  //start of routes
  app.use("/api/user", UserRouter);
  app.use("/api/seller", SellerRouter);

  //handling async errors in apis
  app.use(ErrorHandler);

  //adding additional apis
  app.get("/", (req, res) =>
    res.send({
      error: false,
      message: "SERVER IS LIVE!",
      result: null,
    })
  );
  app.get("*", (req, res) =>
    res
      .status(404)
      .send({ error: true, message: "Route not Found!", result: null })
  );
};

Logger.info("🛣️  Routes setup completed");

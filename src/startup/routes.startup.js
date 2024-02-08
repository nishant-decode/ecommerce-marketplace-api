//middlewares
const express = require("express");
const morgan = require("morgan"); // for consoling api request calls
const helmet = require("helmet"); // secures connection by adding additional header
const cors = require("cors"); // handling cors errors
const cookieParser = require("cookie-parser");
const ErrorHandler = require("../middlewares/error.middlewares"); // error handler for routes, since we will continue to next route upon request

//logger
const Logger = require("../helpers/logger.helpers");

//Routers
const { UserRouter } = require("../routes/user.routes");
const { StoreRouter } = require("../routes/store.routes");
const { ProductRouter } = require("../routes/product.routes");
const { ProductVariantRouter } = require("../routes/productVariant.routes");
const { ServiceRouter } = require("../routes/service.routes");
const { EventRouter } = require("../routes/event.routes");
const { TicketRouter } = require("../routes/ticket.routes");
const { ReviewRouter } = require("../routes/review.routes");
const { ReportRouter } = require("../routes/report.routes");
const { PostRouter } = require("../routes/post.routes");
const { OrderRouter } = require("../routes/order.routes");
const { OfferRouter } = require("../routes/offer.routes");
const { NotificationRouter } = require("../routes/notification.routes");
const { ListRouter } = require("../routes/list.routes");
const { FollowRouter } = require("../routes/follow.routes");
const { CartRouter } = require("../routes/cart.routes");
const { CommentRouter } = require("../routes/comment.routes");
const { AddressRouter } = require("../routes/address.routes");

module.exports = (app) => {
  app.use(express.json({ limit: "9999000009mb" })); // body parser, parses request body
  app.use(express.urlencoded({ extended: true })); // parses encoded url
  app.use(cookieParser());
  app.use(morgan("tiny")); // initiating console api requests
  app.use(helmet());
  app.use(cors());

  //start of routes
  app.use("/api/user", UserRouter);
  app.use("/api/store", StoreRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/productVariant", ProductVariantRouter);
  app.use("/api/service", ServiceRouter);
  app.use("/api/event", EventRouter);
  app.use("/api/ticket", TicketRouter);
  app.use("/api/review", ReviewRouter);
  app.use("/api/report", ReportRouter);
  app.use("/api/post", PostRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/offer", OfferRouter);
  app.use("/api/notification", NotificationRouter);
  app.use("/api/list", ListRouter);
  app.use("/api/follow", FollowRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/comment", CommentRouter);
  app.use("/api/address", AddressRouter);

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

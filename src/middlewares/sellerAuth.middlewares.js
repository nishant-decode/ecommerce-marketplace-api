const jwt = require('jsonwebtoken');

const { SellerService } = require("../services/seller.service");

const Logger = require("../helpers/logger.helpers");
const HttpError = require('../helpers/httpError.helpers');

const { JWT_SECRET } = process.env;

const SellerAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      throw new HttpError(401, 'Unauthorized: Missing Token');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    const seller = await SellerService.findById(decoded._doc._id);
    console.log(seller)
    if (!seller || !decoded._id === seller._id) {
      throw new HttpError(401, 'Unauthorized: Invalid Token');
    }

    req.user = seller;

    Logger.info(`Seller authenticated: ${seller}`);
    next();
};

module.exports = { SellerAuth };
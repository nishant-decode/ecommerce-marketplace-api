const jwt = require('jsonwebtoken');

const { UserService } = require("../services/user.service");

const Logger = require("../helpers/logger.helpers");
const HttpError = require('../helpers/httpError.helpers');

const { JWT_SECRET } = process.env;

const Auth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      throw new HttpError(401, 'Unauthorized: Missing Token');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserService.findById(decoded._id);

    if (!user || !decoded._id === user._id) {
      throw new HttpError(401, 'Unauthorized: Invalid Token');
    }

    req.user = user;

    Logger.info(`Admin authenticated: ${user}`);
    next();
};

module.exports = { Auth };
const { sendMail } = require("../helpers/mailSender.helper");
const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { UserService } = require("../services/user.service");

class UserController {
  //@desc Register a user
  //@route POST /api/user/register
  //@access public
  register = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { firstName, lastName, password, email, role } = req.body;
    if (!firstName || !email || !password) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const userAvailable = await UserService.findOne({ email });
    if (userAvailable) {
      throw new HttpError(400, "User already registered!");
    }

    const user = await UserService.create({
      name: {
        first: firstName,
        last: lastName,
      },
      password,
      email,
      role,
    });

    if (user) {
      Logger.info(`User Created: ${user}`);
      Response(res)
        .status(201)
        .message("User created successfully")
        .body({ user })
        .send();
    } else {
      throw new HttpError(400, "User data is not valid");
    }
  };

  //@desc send OTP to a user for registeration
  //@route POST /api/user/sendOtp
  //@access public
  sendOtp = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email } = req.body;
    const user = await UserService.findOne({ email });
    if (!user) {
      throw new HttpError(401, "User does not exsist!");
    }

    if (user.accountStatus) {
      if (
        user.accountStatus.blocked &&
        user.accountStatus.expiresAt > Date.now()
      ) {
        throw new HttpError(404, "User account blocked!");
      } else {
        user.accountStatus = undefined;
        await user.save();
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.registerOtp.otp = otp;
    user.registerOtp.expiresAt = Date.now() + 43200000;
    await user.save();

    await sendMail(
      email,
      "OTP Verification",
      `Your OTP for verification is: ${otp}`
    );

    Logger.info(`OTP sent to email: ${user}`);
    Response(res)
      .status(200)
      .message("OTP sent to email!")
      .body({ user })
      .send();
  };

  //@desc verify OTP sent to a user for registeration and login
  //@route POST /api/user/verifyOtp
  //@access public
  verifyOtp = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email, otp } = req.body;
    const user = await UserService.findOne({ email });
    if (!user) {
      throw new HttpError(401, "User does not exist!");
    }

    if (user.registerOtp.expiresAt < Date.now()) {
      throw new HttpError(401, "Otp Expired!");
    }

    if (user.registerOtp.otp !== otp) {
      if (user.registerOtp.attempts) {
        user.registerOtp.attempts = user.registerOtp.attempts + 1;
      } else {
        user.registerOtp.attempts = 1;
      }

      if (user.registerOtp.attempts >= 5) {
        user.accountStatus.blocked = true;
        user.accountStatus.expiresAt = Date.now() + 43200000;
        await user.save();
        throw new HttpError(401, "Account Blocked!");
      }
      await user.save();
      throw new HttpError(401, "Invalid Otp!");
    }

    user.emailVerified = true;
    user.accountStatus = undefined;
    user.registerOtp = undefined;
    await user.save();

    Logger.info(`OTP has been verified: ${user}`);
    Response(res)
      .status(200)
      .message("OTP has been verified!")
      .body({ user })
      .send();
  };

  //@desc login user after email verification through OTP
  //@route POST /api/user/login
  //@access public
  login = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const user = await UserService.findOne({ email });

    if (
      !user ||
      !user.schema.methods.verifyPassword(password, user.password) ||
      !user.emailVerified
    ) {
      throw new HttpError(401, "User does not exsist!");
    }

    user.sessions = {};
    res.clearCookie("token");
    await user.save();

    const token = user.schema.methods.generateToken(user);
    user.sessions.token = token;
    user.sessions.expiresAt = Date.now() + 43200000;
    await user.save();

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 43200000, // 12 hour
    });

    Logger.info(`User logged In: ${user}`);
    Response(res)
      .status(200)
      .message("User logged In successfully")
      .body({ token })
      .send();
  };

  //@desc if user forgets password then send Token to a user for authentication
  //@route POST /api/user/sendToken
  //@access public
  sendToken = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email } = req.body;
    const user = await UserService.findOne({ email });
    if (!user || !user.emailVerified) {
      throw new HttpError(401, "User does not exsist!");
    }

    const token = user.schema.methods.generateVerifyEmailToken(user);
    user.resetPasswordSessions.token = token;
    user.resetPasswordSessions.expiresAt = Date.now() + 43200000;
    await user.save();

    await sendMail(
      email,
      "Token Verification",
      `Your Token for verification is: ${token}`
    );

    Logger.info(`Token sent to email: ${user}`);
    Response(res)
      .status(200)
      .message("Token sent to email!")
      .body({ user })
      .send();
  };

  //@desc if user forgets password then verify Token sent to the user for authentication and login
  //@route POST /api/user/verifyToken
  //@access public
  verifyToken = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email, resetToken } = req.body;
    const user = await UserService.findOne({ email });
    if (!user || !user.emailVerified) {
      throw new HttpError(401, "User does not exist!");
    }

    if (user.resetPasswordSessions.expiresAt < Date.now()) {
      throw new HttpError(401, "Token Expired!");
    }

    if (user.resetPasswordSessions.token !== resetToken) {
      throw new HttpError(401, "Invalid Token!");
    }

    user.sessions = undefined;

    const token = user.schema.methods.generateToken(user);
    user.sessions.token = token;
    user.sessions.expiresAt = Date.now() + 43200000;
    await user.save();

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 43200000, // 12 hour
    });

    user.resetPasswordSessions = undefined;
    await user.save();

    Logger.info(`resetToken has been verified: ${user}`);
    Response(res)
      .status(200)
      .message("resetToken has been verified!")
      .body({ user })
      .send();
  };

  //@desc reset Password for logged in user
  //@route POST /api/user/resetPassword
  //@access private
  resetPassword = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { email, newPassword } = req.body;
    const user = await UserService.findOne({ email });
    if (!user) {
      throw new HttpError(401, "User does not exsist!");
    }

    console.log(user._id + " " + req.user._id + " " + req.user.role);

    if (
      user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      throw new HttpError(401, "Unauthorized!");
    }

    user.password = newPassword;
    await user.save();

    Logger.info(`Password has been reset: ${user}`);
    Response(res)
      .status(200)
      .message("Password has been reset!")
      .body({ user })
      .send();
  };

  //@desc logout user
  //@route POST /api/user/logout
  //@access private
  logout = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.user._id;

    await UserService.findByIdAndUpdate({ _id: userId }, { sessions: {} });

    res.clearCookie("token");

    Logger.info(`User logged out`);
    Response(res).status(200).message("User logged out!").send();
  };

  //@desc get all users
  //@route GET /api/user/
  //@access private
  getAllUsers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const users = await UserService.find({});

    Logger.info(`All users: ${users}`);
    Response(res).status(200).message("All users").body({ users }).send();
  };

  //@desc get user by userId
  //@route GET /api/user/:userId
  //@access private
  getUser = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.userId;
    const user = await UserService.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (
      user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      throw new HttpError(401, "Unauthorized!");
    }

    Logger.info(`User: ${user}`);
    Response(res).status(200).message("User found").body({ user }).send();
  };

  //@desc update user by userId
  //@route PUT /api/user/:userId
  //@access private
  updateUser = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.userId;
    const updates = req.body;

    const user = await UserService.findByIdAndUpdate(userId, { ...updates });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    Logger.info(`User Updated: ${user}`);
    Response(res).status(200).message("User Updated").body({ user }).send();
  };

  //@desc delete user by userId
  //@route DELETE /api/user/:userId
  //@access private
  deleteUser = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const userId = req.params.userId;

    const user = await UserService.findByIdAndDelete(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    Logger.info(`User Deleted: ${user}`);
    Response(res).status(200).message("User Deleted").body({ user }).send();
  };
}

module.exports.UserController = new UserController();

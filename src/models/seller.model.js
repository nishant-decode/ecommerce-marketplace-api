const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Hasher = require("../helpers/hasher.helper")
const { JWT_SECRET, JWT_EMAIL_VERIFY_SECRET, JWT_EXPIRY } = process.env;

const schema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
      },
    },
    storeName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: Boolean,
    type: {
      type: String,
      enum: ["Product", "Service", "Event"],
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "type",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notify: [
      {
        notification: {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        },
      },
    ],
    offers: [{
        offer: {
            name: String,
            discount: Number,
        }
    }],
    accountStatus: {
      blocked: {
        type: Boolean,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
    registerOtp: {
      otp: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
      attempts: {
        type: Number,
        default: undefined,
      },
    },
    resetPasswordSessions: {
      token: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
    sessions: {
      token: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  const salt = await Hasher.getSalt(10);
  const hash = await Hasher.hash(user.password, salt);
  user.password = hash;
  next();
});

schema.methods.verifyPassword = function (password, currentPass) {
  return new Promise((resolve, reject) => {
    Hasher.compare(password, currentPass)
      .then((isMatch) => resolve(isMatch))
      .catch((err) => reject(err));
  });
};

schema.methods.generateToken = (data) => {
  return jwt.sign(
    { ...data },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

schema.methods.generateVerifyEmailToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    JWT_EMAIL_VERIFY_SECRET || "abcd",
    { expiresIn: JWT_EXPIRY }
  );
};

const Seller = mongoose.model("Seller", schema);

module.exports.Seller = Seller;

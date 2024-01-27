const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      original: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
    },
    location: [
      {
        option: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    available: [
      {
        date: Date,
      },
    ],
    info: {
      highlights: {
        type: String,
        required: true,
      },
      policy: {
        type: String,
        required: true,
      },
    },
    details: [
      {
        detail: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    url: {
      images: [
        {
          type: String,
          required: true,
        },
      ],
      documents: [
        {
          type: String,
        },
      ],
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        values: [
          {
            type: String,
            required: true,
          },
        ],
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
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

schema.methods.verifyPassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    Hasher.compare(candidatePassword, this.password)
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

const Service = mongoose.model("Service", schema);

module.exports.Service = Service;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// CREATE SCHEMA
const usersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "The user must have a fullname"],
    minLength: [3, "fullname is too short"],
    maxLength: [50, "fullname is too long"],
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "customer"],
    default: "customer",
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    require: true,
    trim: true,
    minLength: [6, "The password is too short"],
    maxLength: [50, "The password is too long"],
    select: false,
  },
  photo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  billingAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
  },
  shippingAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// MIDDLEWARE

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 11);
  next();
});

// CREATE MODEL
const User = mongoose.model("Users", usersSchema);

async function initialize() {
  await User.init();
}
initialize();

module.exports = User;

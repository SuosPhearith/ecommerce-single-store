const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// CREATE SCHEMA
const accountsSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
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
    require: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  profile: String,
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

// CREATE MODEL
const Account = mongoose.model("Accounts", accountsSchema);

async function initialize() {
  await Account.init();
}
initialize();

module.exports = Account;

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  updated: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;

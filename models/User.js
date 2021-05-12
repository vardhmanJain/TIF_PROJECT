const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    default: Date.now(),
  },
});
// userSchema.pre("findOneAndUpdate", async (next) => {
//   const salt = await bcrypt.genSalt();
//   console.log(this);
//   this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
//   next();
// });
const User = mongoose.model("user", userSchema);
module.exports = User;

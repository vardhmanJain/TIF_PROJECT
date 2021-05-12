const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scopes: {
    type: [{ type: String }],
    default: [],
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

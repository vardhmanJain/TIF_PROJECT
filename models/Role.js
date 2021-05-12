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
  updated: Date,
});
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

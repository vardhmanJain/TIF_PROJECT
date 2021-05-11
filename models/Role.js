const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({
  name: String,
  scopes: [{ type: String }],
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: Date,
});
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

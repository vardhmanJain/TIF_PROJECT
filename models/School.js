const mongoose = require("mongoose");
const schoolSchema = mongoose.Schema({
  public_id: {
    type: String,
    unique: true,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
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

const School = mongoose.model("School", schoolSchema);
module.exports = School;

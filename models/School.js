const mongoose = require("mongoose");
const schoolSchema = mongoose.Schema({
  public_id: {
    type: mongoose.Schema.Types.ObjectId,
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
    default: null,
  },
});

const School = mongoose.model("School", schoolSchema);
module.exports = School;

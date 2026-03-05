const mongoose = require("mongoose");

const timbreSchema = new mongoose.Schema({
  name: String,
  description: String,
  file: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Timbre", timbreSchema);
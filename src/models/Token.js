const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Token database model

const Token = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Token", Token);

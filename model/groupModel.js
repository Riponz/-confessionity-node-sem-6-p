const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  admin: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  posts: [
    {
      username: { type: String },
      date: {
        type: Date,
        default: Date.now,
        required: true,
      },
      content: { type: String },
      comments: [String],
    },
  ],
});

module.exports = mongoose.model("group", groupSchema);

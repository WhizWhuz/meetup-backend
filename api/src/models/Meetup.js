const mongoose = require("mongoose");

const meetupSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Meetup", meetupSchema);

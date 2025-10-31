const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Användaren behöver en mejl."],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Var god att lägga in en mejl!"],
    },
    password: {
      type: String,
      required: [true, "Användaren måste ha ett lösenord."],
      minlength: 6,
    },
    name: {
      type: String,
      default: "Anonymous",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);

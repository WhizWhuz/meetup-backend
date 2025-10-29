const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
// const meetupRoutes = require("./routes/meetupRoutes");

app.use(cors());
app.use(express.json());

app.use("api/auth", authRoutes);
// app.use("api/meetups", meetupRoutes);

app.use((err, req, res, next) => {
  console.error("Global error.", err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const meetupRoutes = require("./routes/meetupRoutes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/meetups", meetupRoutes);

//! Error Handlers

app.use((err, req, res, next) => {
  console.error("Global error.", err);
  res.status(500).json({ message: "Server error" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Server error",
  });
});

module.exports = app;

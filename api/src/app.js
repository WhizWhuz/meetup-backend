const YAML = require("yamljs");

const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("Global error.", err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;

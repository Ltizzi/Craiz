const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(morgan("combined"));

app.use(express.json());

module.exports = app;

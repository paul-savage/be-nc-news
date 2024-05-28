const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

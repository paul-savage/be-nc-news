const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const express = require("express");

const { getApis } = require("./controllers/apis.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");

const app = express();

app.get("/api", getApis);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

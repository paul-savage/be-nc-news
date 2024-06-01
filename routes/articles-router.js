const articleRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
} = require("../controllers/articles.controllers");

articleRouter.get("/", getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

// articleRouter.get("/:article_id", getArticleById);
// articleRouter.patch("/:article_id", patchArticleById);

// articleRouter.get("/:article_id/comments", getCommentsByArticleId);
// articleRouter.post("/:article_id/comments", postCommentsByArticleId);

module.exports = articleRouter;

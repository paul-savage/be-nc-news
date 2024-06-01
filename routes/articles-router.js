const articleRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
  postArticle,
} = require("../controllers/articles.controllers");

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;

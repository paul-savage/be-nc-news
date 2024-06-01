const articleRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;

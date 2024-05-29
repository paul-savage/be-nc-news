const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  storeCommentsByArticleId,
  updateArticleById,
  checkExists,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then((results) => {
      const comments = results[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;
  const { username } = data;

  Promise.all([
    checkExists("users", "username", username),
    checkExists("articles", "article_id", article_id),
  ])
    .then(() => {
      return storeCommentsByArticleId(article_id, data);
    })
    .then((rows) => {
      const comment = rows[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;
  const { inc_votes } = data;

  updateArticleById(article_id, inc_votes)
    .then((rows) => {
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

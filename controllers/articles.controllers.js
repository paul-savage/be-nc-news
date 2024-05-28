const {
  fetchArticleById,
  fetchArticles,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

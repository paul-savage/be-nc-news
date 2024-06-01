const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  storeCommentsByArticleId,
  updateArticleById,
  storeArticle,
  checkExists,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkExists("articles", "article_id", article_id)
    .then(() => {
      return fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  fetchArticles(topic, p, limit, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  Promise.all([
    fetchCommentsByArticleId(article_id, p, limit),
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

exports.postArticle = (req, res, next) => {
  const data = req.body;
  const { author, title, body, topic, article_img_url } = data;

  Promise.all([
    checkExists("users", "username", author),
    checkExists("topics", "slug", topic),
  ])
    .then(() => {
      return storeArticle(author, title, body, topic, article_img_url);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

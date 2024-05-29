const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author,
              articles.title,
              articles.article_id,
              articles.topic,
              articles.created_at,
              articles.votes,
              articles.article_img_url,
              COUNT(comments.article_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * 
       FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.storeCommentsByArticleId = (article_id, data) => {
  return db
    .query(
      `INSERT INTO comments
      (body, article_id, author)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [data.body, article_id, data.username]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `SELECT votes 
       FROM articles
       WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    })
    .then((article) => {
      const new_votes = article.votes + inc_votes;
      return db
        .query(
          `UPDATE articles
           SET votes = $1 
           WHERE article_id = $2
           RETURNING *;`,
          [new_votes, article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};

exports.checkExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};

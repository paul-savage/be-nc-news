const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.body,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id)::INT AS comment_count
       FROM articles
       LEFT JOIN comments
       ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (
  topic,
  p = 1,
  limit = 10,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  const validOrderBy = ["asc", "desc"];

  p = Number(p);
  const validP = !isNaN(p) && p > 0 && p === Math.trunc(p);

  limit = Number(limit);
  const validLimit = !isNaN(limit) && limit > 0 && limit === Math.trunc(limit);

  if (
    !validP ||
    !validLimit ||
    !validSortBy.includes(sort_by) ||
    !validOrderBy.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const values = [];
  let sqlQuery = `SELECT
                articles.author,
                articles.title,
                articles.article_id,
                articles.topic,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.article_id)::INT AS comment_count,
                COUNT(*) OVER()::INT AS total_count
                FROM articles
                LEFT JOIN comments
                ON articles.article_id = comments.article_id`;

  if (topic) {
    values.push(topic);
    sqlQuery += ` WHERE articles.topic = $${values.length}`;
  }

  sqlQuery += ` GROUP BY articles.article_id
                ORDER BY articles.${sort_by} ${order}`;

  values.push(limit);
  sqlQuery += ` LIMIT $${values.length}`;

  values.push((p - 1) * limit);
  sqlQuery += ` OFFSET $${values.length}`;

  sqlQuery += ";";

  return db.query(sqlQuery, values).then(({ rows }) => {
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

exports.storeArticle = (author, title, body, topic, article_img_url) => {
  const values = [author, title, body, topic];

  let sqlQuery = `INSERT INTO articles
                  (author, title, body, topic)
                  VALUES ($1, $2, $3, $4)
                  RETURNING *;`;

  if (article_img_url) {
    values.push(article_img_url);
    sqlQuery = `INSERT INTO articles
                (author, title, body, topic, article_img_url)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;`;
  }
  return db.query(sqlQuery, values).then(({ rows }) => {
    const article_id = rows[0].article_id;
    return this.fetchArticleById(article_id);
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

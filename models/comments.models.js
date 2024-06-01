const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return db
    .query(
      `SELECT votes 
       FROM comments
       WHERE comment_id = $1;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    })
    .then((comment) => {
      const new_votes = comment.votes + inc_votes;
      return db
        .query(
          `UPDATE comments
           SET votes = $1 
           WHERE comment_id = $2
           RETURNING *;`,
          [new_votes, comment_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};

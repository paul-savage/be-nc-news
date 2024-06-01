const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models.js");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const data = req.body;
  const { inc_votes } = data;

  updateCommentById(comment_id, inc_votes)
    .then((rows) => {
      const comment = rows[0];
      res.status(200).send({ comment });
    })
    .catch(next);
};

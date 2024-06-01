const commentRouter = require("express").Router();

const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", patchCommentById);

module.exports = commentRouter;

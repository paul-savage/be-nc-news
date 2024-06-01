const topicRouter = require("express").Router();

const { getTopics, postTopics } = require("../controllers/topics.controllers");

topicRouter.route("/").get(getTopics).post(postTopics);

module.exports = topicRouter;

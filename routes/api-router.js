const apiRouter = require("express").Router();

const topicRouter = require("./topics-router");
const commentRouter = require("./comments-router");
const articleRouter = require("./articles-router");
const userRouter = require("./users-router");

const { getApis } = require("../controllers/apis.controllers");

apiRouter.get("/", getApis);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;

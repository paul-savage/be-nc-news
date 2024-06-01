const userRouter = require("express").Router();

const { getUsers, getUserByName } = require("../controllers/users.controllers");

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByName);

module.exports = userRouter;

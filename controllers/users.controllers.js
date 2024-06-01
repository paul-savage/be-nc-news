const { fetchUsers, fetchUserByName } = require("../models/users.models.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByName = (req, res, next) => {
  const { username } = req.params;
  return fetchUserByName(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

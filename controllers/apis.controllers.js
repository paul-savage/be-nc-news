const { fetchApis } = require("../models/apis.models");

exports.getApis = (req, res, next) => {
  fetchApis()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

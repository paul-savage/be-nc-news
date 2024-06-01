const { fetchTopics, storeTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopics = (req, res, next) => {
  const data = req.body;
  const { slug, description } = data;

  storeTopic(slug, description)
    .then((rows) => {
      const topic = rows[0];
      res.status(201).send({ topic });
    })
    .catch(next);
};

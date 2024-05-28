const endpoints = require("../endpoints.json");

exports.fetchApis = () => {
  return Promise.resolve(endpoints);
};

const { fetchUsers, fetchUserByUsername } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
    const { sort_by, order } = request.query
  
  fetchUsers(sort_by, order)
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (request, response, next) => {
  
    const { username } = request.params

    fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user })
    })
    .catch(next)
}
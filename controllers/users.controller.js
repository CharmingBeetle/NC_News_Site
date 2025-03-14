const { fetchUsers } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
    const { sort_by, order } = request.query
  
  fetchUsers(sort_by, order)
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

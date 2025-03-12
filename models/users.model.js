const db = require("../db/connection");

exports.fetchUsers = (sort_by = "username", order = "asc") => {
  const validSorts = ["username", "name"];
  const validOrder = ["asc", "desc"];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort input" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }
  let sqlQuery = `
            SELECT * 
            FROM 
            users 
    `;

  sqlQuery += ` ORDER BY ${sort_by} ${order.toLowerCase()}`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

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


exports.fetchUserByUsername = (username)=> {
  const allowedInput = /^[-\w\.\$&@\*\!]{1,30}$/
  const inputIsValid = username.match(allowedInput)
  if(!inputIsValid){
    return Promise.reject({status:400, msg:"Invalid username"})
  }
  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
  .then(({ rows })=> {
    if(!rows.length) {
      return Promise.reject({ status:404, msg: "User not found"})
    }
    return rows[0]
  })
}
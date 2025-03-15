const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  console.log("CONNECTED TO MODEL....")
  if(typeof inc_votes !== "number") {
    return Promise.reject({status:400, msg:"Invalid input"})
  }

  let sqlQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`;


const queryValues = [inc_votes, comment_id]

return db.query(sqlQuery, queryValues)
.then(({ rows })=> {
  console.log(rows[0], "<<<<<< PATCHED COMMENT")
  return rows[0]
})
}



exports.checkIfCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: `Comment ${comment_id} not found` });
      }
      return comment_id;
    });
};

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

exports.checkIfCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return comment_id;
    });
};

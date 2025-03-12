const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validSorts = [
    "title",
    "author",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort input" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }
  let sqlQuery = `
        SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM 
        articles
        LEFT JOIN 
        comments ON articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id `;


    sqlQuery += ` ORDER BY ${sort_by} ${order.toLowerCase()}`;


  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  if (!article_id) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      throw error;
    });
};

exports.createComment = (
  article_id,
  article_title,
  body,
  votes,
  author,
  created_at
) => {
  if (
    typeof article_title !== "string" ||
    typeof body !== "string" ||
    typeof author !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      `
        INSERT INTO comments 
        (article_id, 
        article_title, 
        body, 
        votes, 
        author, 
        created_at) 
        VALUES 
        ($1, $2, $3, $4, $5, $6) 
        RETURNING *
        `,
      [article_id, article_title, body, votes, author, created_at]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVoteByArticleId = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  let sqlQuery = `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *`;

  const queryValues = [inc_votes, article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows[0];
  });
}; 

exports.checkIfUserExists = (author) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: `User ${author} not found` });
      }
      return rows[0];
    });
};

exports.checkIfArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} not found`,
        });
      }
      return rows[0];
    });
};

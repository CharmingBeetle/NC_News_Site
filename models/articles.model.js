const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  let sqlQuery = `
    SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.body,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM 
    articles
    LEFT JOIN 
    comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id`;

  return db.query(sqlQuery, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found!" });
    }
    return rows[0];
  });
};

exports.fetchArticles = (sort_by = "created_at", order = "asc", topic) => {
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

  if (sort_by && !validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort input" });
  }
  if (order && !validOrder.includes(order)) {
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
        `;

  const queryValues = [];

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toLowerCase()}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
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

exports.createComment = (article_id, body, username) => {
  return this.checkIfArticleExists(article_id)
    .then((article) => {
      return db.query(
        `
        INSERT INTO comments 
        (article_id, 
        article_title,
        body,  
        author, 
        votes, 
        created_at)
        VALUES 
        ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP) 
        RETURNING *
        `,
        [article_id, article.title, body, username]
      );
    })
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

exports.checkIfUserExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `User ${username} not found`,
        });
      }
      return true;
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

exports.checkThatTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Topic '${topic}' does not exist`,
        });
      }
      return topic;
    });
};

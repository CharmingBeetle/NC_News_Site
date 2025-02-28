const db = require("../connection");
const articles = require("../data/test-data/articles");

const seed = ({ topicData, userData, articleData, commentData }) => {
  console.log('invoking seed...')
  return db
  .query("DROP TABLE IF EXISTS articles;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS comments;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(() => {
    return createTopics(users);
  })
  .then(() => {
    return createUsers(topics);
  })
  .then(() => {
    return createComments(comments);
  })
  .then(() => {
    return createArticles(articles);
  })
}
//<< write your first query in here.

function createTopics() {
  return db.query(
    // `DROP TABLE IF EXISTS topics;
    `CREATE TABLE topics 
    (slug  VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000) NOT NULL,
    UNIQUE slug
   `
    )
  }

  function createUsers() {
    return db.query(
      // `DROP TABLE IF EXISTS users;
      `CREATE TABLE users 
      (username  PRIMARY KEY ,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL,
      UNIQUE username
     `
      )
    }
  function createArticles() {
    return db.query(
      // `DROP TABLE IF EXISTS articles;
      `CREATE TABLE articles 
      (article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) NOT NULL,
      author VARCHAR(255)) NOT NULL, 
      body TEXT NOT NULL, 
      created_at TIMESTAMP NOT NULL, 
      votes INT DEFAULT 0, 
      article_img_url VARCHAR(1000)`
      )
    }
    function createComments() {
      return db.query(
      // `DROP TABLE IF EXISTS comments;
        `CREATE TABLE comments 
        (comment_id SERIAL PRIMARY KEY NOT NULL,
        article_id INT 
        FOREIGN KEY (article_id) REFERENCES article(article_id),
        body VARCHAR(255) NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(255)
        FOREIGN KEY (author) REFERENCES user(username), 
        body TEXT NOT NULL, 
        created_at TIMESTAMP NOT NULL
        `
        )
      }

module.exports = seed;

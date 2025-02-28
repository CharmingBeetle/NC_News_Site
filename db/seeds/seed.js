const db = require("../connection");
const articles = require("../data/test-data/articles");
const users = require("../data/test-data/index")
const format = require("pg-format");
const topics = require("../data/test-data/index")
const {convertTimestampToDate} = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  console.log('invoking seed...')
  return db
  .query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(() => {
    return createUsers(userData);
  })
  .then(() => {
    return createTopics(topicData);
  })
  .then(() => {
    return createArticles(articleData);
  })
  .then(() => {
    return createComments(commentData);
  })
}
//<< write your first query in here.
function createUsers(users) {
  return db.query(
    `CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY ,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL,
    UNIQUE(username));
   `)
    .then(() => {
      if(!Array.isArray(users)){
        throw new Error("Users is not an array")
      }
      const formattedUsers = users.map((user) => {
      return [
      user.username, 
      user.name, 
      user.avatar_url
    ]})
  
  console.log(formattedUsers, "<<<<< FORMATTED USERS")

      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING*`,
        formattedUsers);
       
        return db.query(insertUsersQuery)
  })
}
function createTopics(topics) {
  return db.query(
    `CREATE TABLE topics(
    slug VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000) NOT NULL,
    UNIQUE(slug));
    `)
    .then(() => {
      const formattedTopics = topics.map((topic) => {
      return [
      topic.slug, 
      topic.description, 
      topic.img_url
    ]})
  
  console.log(formattedTopics, "<<<<< FORMATTED TOPICS")
      const insertTopicsQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING*`,
        formattedTopics);
        console.log(insertTopicsQuery)
        return db.query(insertTopicsQuery)
  });
}
  function createArticles(articles) {
    return db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL, 
      body TEXT NOT NULL, 
      created_at TIMESTAMP NOT NULL, 
      votes INT DEFAULT 0, 
      article_img_url VARCHAR(1000)
    );
    `)
    .then(() => {
      const formattedArticles = articles.map((article) => {
       const formatArticle = convertTimestampToDate(article)
       console.log(formatArticle, "<<<<< formatted timestamp")
      return [
      formatArticle.title, 
      formatArticle.topic, 
      formatArticle.author, 
      formatArticle.body, 
      formatArticle.created_at,
      formatArticle.votes, 
      formatArticle.article_img_url
    ]})
  
  console.log(formattedArticles, "<<<<< FORMATTED TOPICS")
      const insertArticlesQuery = format(
        `INSERT INTO articles (title,topic,author,body,created_at,votes, article_img_url) VALUES %L RETURNING*`,
        formattedArticles);
        console.log(insertArticlesQuery)
        return db.query(insertArticlesQuery)
  });
    }
    function createComments(comments) {
      return db.query(
      `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY NOT NULL,
        article_id INT,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(255),
        FOREIGN KEY(author) REFERENCES users(username), 
        created_at TIMESTAMP NOT NULL);
        `)
        .then(() => {
          const formattedComments = comments.map((comment) => {
           const formatComment = convertTimestampToDate(comment)
           console.log(formatComment, "<<<<< formatted timestamp")
          return [
          formatComment.article_id, 
          formatComment.body, 
          formatComment.votes, 
          formatComment.author, 
          formatComment.created_at 
        ]})
      
          const insertCommentsQuery = format(
            `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING*`,
            formattedComments);
            return db.query(insertCommentsQuery)
      });
      }

module.exports = seed;

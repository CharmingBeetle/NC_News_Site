const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, getformattedArray } = require("./utils")
const { createLookupObject } = require("./utils")


const seed = ({ topicData, userData, articleData, commentData }) => {
  // console.log('invoking seed...')
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
  .then((articleLookup) => {
    return createComments(commentData, articleLookup);
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
      const keys = ['username', 'name', 'avatar_url']
      const formattedUsers = getformattedArray(users, keys)
      // console.log(formattedUsers, "<<< FORMATTED USERS")
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
      const keys = ['slug', 'description', 'img_url']
      const formattedTopics = getformattedArray(topics, keys)
    //   const formattedTopics = topics.map((topic) => {
    //   return [
    //   topic.slug, 
    //   topic.description, 
    //   topic.img_url
    // ]})
  
      const insertTopicsQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING*`,
        formattedTopics);
        
        return db.query(insertTopicsQuery)
  });
}
function createArticles(articles) {
    return db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) REFERENCES topics(slug),
      author VARCHAR(255) REFERENCES users(username), 
      body TEXT NOT NULL, 
      created_at TIMESTAMP NOT NULL, 
      votes INT DEFAULT 0, 
      article_img_url VARCHAR(1000)
    );
    `)
    .then(() => {
      const formattedArticles = articles.map((article) => {
        const formatArticle = convertTimestampToDate(article)
       
      return [
      formatArticle.title, 
      formatArticle.topic, 
      formatArticle.author, 
      formatArticle.body, 
      formatArticle.created_at,
      formatArticle.votes, 
      formatArticle.article_img_url
    ]})
    // console.log(formattedArticles, "<<<FORMATTED ARTICLES")
      const insertArticlesQuery = format(
        `INSERT INTO articles (title,topic,author,body,created_at,votes, article_img_url) VALUES %L RETURNING*`,
        formattedArticles);
        return db.query(insertArticlesQuery)
  })
  .then(({rows})=> {
    const articleLookup = createLookupObject(rows, 'title', 'article_id')
    // console.log(articleLookup, "<<<<ARTICLE LOOKUP")
    // console.log(rows, "<<<<HERE ARE THE ROWS")
    return articleLookup
  })
    }
function createComments(comments, articleLookup) {
      return db.query(
      `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY NOT NULL,
        article_id INT,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        article_title VARCHAR(255),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(255),
        FOREIGN KEY(author) REFERENCES users(username), 
        created_at TIMESTAMP NOT NULL);
        `)
        .then(() => {
          const formattedComments = comments.map((comment) => {
           const formatComment = convertTimestampToDate(comment)
        
          return [
          articleLookup[formatComment.article_title],
          formatComment.article_title,
          formatComment.body, 
          formatComment.votes, 
          formatComment.author, 
          formatComment.created_at 
        ]})
      // console.log(formattedComments, "<<<<FORMATTED COMMENTS ")
     
          const insertCommentsQuery = format(
            `INSERT INTO comments (article_id, article_title, body, votes, author, created_at) VALUES %L RETURNING*`,
            formattedComments);
            return db.query(insertCommentsQuery)
      })
      .then(({rows})=> {
        // console.log(rows, "<<<<<< HERE ARE THE COMMENTS")
        return rows
      })
      
      }
      

  

module.exports = seed;




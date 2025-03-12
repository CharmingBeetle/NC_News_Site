const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchVoteByArticleId,
} = require("./controllers/articles.controller");
const { deleteCommentById } = require("./controllers/comments.controller")
app.use(express.json());
const { getUsers } = require("./controllers/users.contoller")

//GET ENDPOINTS
app.get("/api", getEndpoints);

//GET
// TOPICS
app.get("/api/topics", getTopics);

// ARTICLES
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVoteByArticleId);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

// COMMENTS
app.delete("/api/comments/:comment_id", deleteCommentById)

// USERS
app.get("/api/users", getUsers)

//ERROR HANDLING
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;

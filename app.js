const cors = require("cors")
const express = require("express");
const apiRouter = require("./routes/api-router");
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
  postArticle,
  getCommentsByArticleId,
  postComment,
  patchByArticleId,
} = require("./controllers/articles.controller");
const { deleteCommentById, patchCommentById } = require("./controllers/comments.controller");

app.use(cors());
app.use(express.json());
const { getUsers, getUserByUsername } = require("./controllers/users.controller");
app.use("/api", apiRouter);

//GET ENDPOINTS
app.get("/api", getEndpoints);

//GET
// TOPICS
app.get("/api/topics", getTopics);

// ARTICLES
app.get("/api/articles", getArticles);
app.post("/api/articles", postArticle)
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchByArticleId);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

// COMMENTS
app.delete("/api/comments/:comment_id", deleteCommentById);
app.patch("/api/comments/:comment_id", patchCommentById);

// USERS
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername)

//ERROR HANDLING
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;

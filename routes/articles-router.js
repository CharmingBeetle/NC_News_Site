const {
  getArticles,
  getArticleById,
  patchByArticleId,
  getCommentsByArticleId,
  postComment,
  postArticle
} = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;

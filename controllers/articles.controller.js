const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  createComment,
  checkIfUserExists,
  checkIfArticleExists,
  updateVoteByArticleId,
  checkThatTopicExists,
} = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  const articlesPromise = fetchArticles(sort_by, order, topic);

  if (!topic) {
    articlesPromise
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next);
  } else {
    Promise.all([checkThatTopicExists(topic), articlesPromise])
      .then(([_, articles]) => {
        response.status(200).send({ articles });
      })
      .catch(next);
  }
};
exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const { body, username } = request.body;
  const { article_id } = request.params;

  if (!username) {
    return next({ status: 400, msg: "Username required" });
  }
  if (!body) {
    return next({ status: 400, msg: "Body is required" });
  }

  checkIfUserExists(username)
    .then(() => {
      return createComment(article_id, body, username);
    })
    .then((newComment) => {
      console.log("New comment created:", newComment);
      response.status(201).send({ newComment });
    })
    .catch(next);
};

exports.patchVoteByArticleId = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  if (!inc_votes) {
    return response
      .status(400)
      .send({ msg: "missing properties in request body" });
  }
  if (isNaN(article_id)) {
    return response.status(400).send({ msg: "Invalid article id" });
  }
  checkIfArticleExists(article_id)
    .then(() => {
      return updateVoteByArticleId(article_id, inc_votes);
    })
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

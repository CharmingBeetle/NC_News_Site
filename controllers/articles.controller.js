const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertComment,
  insertArticle,
  checkIfUserExists,
  checkIfArticleExists,
  updateByArticleId,
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

exports.postArticle = (request, response, next) => {
  const { title, topic, author, body, article_img_url } = request.body

  if(!author || !title || !body || !topic) {
    return next({status: 400, msg:"Missing request"})
  }
 
  if(typeof author !== "string" || typeof title !== "string" || typeof topic !== "string" || typeof body !== "string" || article_img_url && typeof article_img_url !== "string") {
    return next({status: 400, msg:"Invalid field entry"})
  }
 
   checkIfUserExists(author)
  .then(()=> {
    return insertArticle(title, topic, author, body, article_img_url)
  })
    .then((newArticle)=> {
      response.status(201).send({ newArticle })
    })
    .catch(next)
    }


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
      return insertComment(article_id, body, username);
    })
    .then((newComment) => {
      response.status(201).send({ newComment });
    })
    .catch(next);
};

exports.patchByArticleId = (request, response, next) => {
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
      return updateByArticleId(article_id, inc_votes);
    })
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

const { deleteCommentById } = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter
    .route("/")
    .delete(deleteCommentById)


module.exports = commentsRouter;
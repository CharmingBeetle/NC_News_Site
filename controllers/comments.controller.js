const { removeCommentById, checkIfCommentExists } = require("../models/comments.model")

exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params

    checkIfCommentExists(comment_id)
    .then((comment_id)=> {
        return removeCommentById(comment_id)
    })
        .then(()=> {
            response.status(204).send()
        })
        .catch(next)
    }



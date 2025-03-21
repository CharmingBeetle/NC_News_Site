const { removeCommentById, checkIfCommentExists, updateCommentById } = require("../models/comments.model")

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


exports.patchCommentById = (request, response, next) => {
    const { comment_id } = request.params
    const { inc_votes } = request.body

    if (!inc_votes) {
        return response
          .status(400)
          .send({ msg: "missing properties in request body" });
      }
      if (isNaN(comment_id)) {
        return response.status(400).send({ msg: "Invalid comment id" });
      }

    checkIfCommentExists(comment_id)
    .then(()=> {
        return   updateCommentById(comment_id, inc_votes)
    })
        .then((comment)=> {
            response.status(200).send({comment})
    })
    .catch(next)
}

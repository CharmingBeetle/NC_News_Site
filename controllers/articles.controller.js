const { fetchArticleById } = require("../models/articles.model")

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params

    fetchArticleById(article_id)
    .then((article)=> {
        response.status(200).send({ article })
    })
    .catch(next)
}
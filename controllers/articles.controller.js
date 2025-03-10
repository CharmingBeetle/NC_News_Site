const { fetchArticleById, fetchArticles } = require("../models/articles.model")

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params

    fetchArticleById(article_id)
    .then((article)=> {
        response.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (request, response, next) => {
    const { sort_by, order } = request.query

    fetchArticles(sort_by, order)
    .then((articles)=> {
        response.status(200).send({ articles })
    })
    .catch(next)
}
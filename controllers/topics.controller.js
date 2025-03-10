const { fetchTopics } = require("../models/topics.model.js")

exports.getTopics = (request, response, next) => {
    
    fetchTopics()
    .then((topics)=> {
        response.status(200).send({topics})
    })
    .catch(next)
}
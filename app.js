const express = require("express")
const app = express()
const { getEndpoints } = require("./controllers/endpoints.controller")
const { handleServerErrors, handlePsqlErrors, handleCustomErrors } = require("./controllers/errors.controller")
const { getTopics } = require("./controllers/topics.controller")
const { getArticleById, getArticles, getCommentsByArticleId } = require("./controllers/articles.controller")


//GET ENDPOINTS
app.get("/api", getEndpoints)

//TOPICS TABLES
 //GET
app.get("/api/topics", getTopics)

// ARTICLES
app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

//COMMENTS
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

//POST 
// app.post()
//ERROR HANDLING
app.all('*', (req, res)=> {
    res.status(404).send({msg: "Path not found"})
})

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app
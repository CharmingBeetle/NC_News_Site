const express = require("express")
const app = express()
const { getEndpoints } = require("./controller.js/endpoints.controller")
app.use(express.json())

//GET 
app.get("/api", getEndpoints)

// app.get("/api/topics", getTopics)

// app.get("api/articles", getArticles)



module.exports = app
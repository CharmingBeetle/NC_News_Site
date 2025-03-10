const db = require("../db/connection")


exports.fetchArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
  .then(({ rows })=> {
    if(!rows.length) {
        return Promise.reject({status: 404, msg: "Article not found!"})
    }
    return rows[0]
  })
}

exports.fetchArticles = (sort_by='created_at', order='desc') => {
    const validSorts = ['title', 'author', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url']
    const validOrder = ['asc', 'desc']
        
    if (!validSorts.includes(sort_by)) {
        return Promise.reject({status:400, msg: "Invalid sort input"})
    }
    if(!order || !validOrder.includes(order)) {
        return Promise.reject({status: 400, msg: "Invalid order"})
    }
        let sqlQuery= `
        SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM 
        articles
        LEFT JOIN 
        comments ON articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id `

        if(sort_by && validSorts.includes(sort_by)) {
            sqlQuery += ` ORDER BY ${sort_by} ${order.toLowerCase()}`
        }
        console.log(sqlQuery, "<<<< SQL query")
    return db.query(sqlQuery)
    .then(({ rows })=> {
        return rows
    })
}


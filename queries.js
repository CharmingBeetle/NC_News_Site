const db = require("./db/connection")


async function getUsers() {
    try {
        const response = await db.query('SELECT * FROM users')
        console.log(`ALL NC USERS: `, response.rows)
        return response.rows
    } catch (err) {
        console.error('Error getting users table!', err)
        throw err
    }
}
  getUsers()
  .then(()=> {
    console.log("Query completed!")
  })


async function getCodingArticles() {
    try {
        const response = await db.query(`SELECT * FROM articles WHERE topic = 'coding'`)
        console.log(`Articles: `, response.rows)
        return response.rows
    } catch (err) {
        console.error('Error getting articles table!', err)
        throw err
    }
}
getCodingArticles()
.then(()=> {
    console.log("Query completed!")
});


async function getUnpopularComments() {
    try{
        const response = await db.query('SELECT * FROM comments WHERE votes < 0')
        console.log(`Unpopular Comments:`, response.rows)
        return response.rows
    } catch(err) {
        console.error('Error getting comments table!', err)
        throw err
    }
    }
getUnpopularComments()
.then(()=> {
    console.log("Query completed!")
});

async function getTopics() {
    try {
    const response = await db.query('SELECT * FROM topics')
    console.log("ALL TOPICS: ", response.rows)
    return response.rows 
} catch(err) {
    console.error('Error getting topics table!', err)
    throw err
}
}
getTopics()
.then(()=> {
    console.log("Query completed!")
})

async function getArticleByUser(author) {
    try {
        const response = await db.query('SELECT title FROM articles WHERE author = $1',[author])
        console.log(`ARTICLES BY USER: ${author}`,response.rows)
        return response.rows
    } catch (err) {
        console.error('Error gettting articles table!', err)
        throw err
    }
}
getArticleByUser('grumpy19')
.then(()=> {
    console.log("Query completed!/n")
})

async function getPopularComments() {
    try {
        const response = await db.query('SELECT * FROM comments WHERE votes > 10' )
        console.log("POPULAR COMMENTS: ", response.rows)
        return response.rows
    } catch (err) {
        console.error("'Error getting comments table!', err")
        throw err
    }
}
getPopularComments()
.then(()=> {
    console.log("Query completed!")
})
.then(()=> {
    db.end()
    console.log("Connection closed.")
})


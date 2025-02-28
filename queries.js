const db = require("./db/connection")
const format = require("pg-format")

const sqlQuery = format('SELECT * FROM users = %L', );
// SELECT * FROM t WHERE c1 IN ('1','2','3') AND c2 = '{"a":1,"b":2}'
    console.log(sqlQuery)
    return db.query(sqlQuery)
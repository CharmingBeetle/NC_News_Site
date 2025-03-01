const db = require("./db/connection")
const format = require("pg-format")
const user = require("./db/data/test-data/index")

// const sqlQuery = format('SELECT * FROM users = %L', users);
// // SELECT * FROM t WHERE c1 IN ('1','2','3') AND c2 = '{"a":1,"b":2}'
//     console.log(sqlQuery)
//     return db.query(sqlQuery)
// Function to query the users table
async function getUsers() {
    try {
      await db.connect(); // Connect to the database
      const res = await db.query('SELECT * FROM users;'); // Execute the query
      console.log("Users:", res.rows); // Log the results
      return res.rows; // Return the results
    } catch (err) {
      console.error("Error querying users table:", err);
    }
      await db.end(); // Disconnect from the database
    }
  
  
  // Call the function
  getUsers();



  async function getCodingArticles() {
  try {
    return new Promise((resolve, reject))=> {
    
    }
  } catch  {
    
  }
    
  }
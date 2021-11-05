const { Pool } = require('pg');

const conn = new Pool({
    
    // signup on elephantsql.com for your own postgreSQL instance
    
    host: "***********",
    user: "********",
    db: "**********",
    password: "*********************"
})

module.exports = {
    query: (QueryString, params) => {
        return conn.query(QueryString, params);
    }
}



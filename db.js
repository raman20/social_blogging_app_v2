const { Pool } = require('pg');

const conn = new Pool({
    host: "batyr.db.elephantsql.com",
    user: "krbrerei",
    db: "krbrerei",
    password: "MBi40UsOQxdaPPVTYtdoNyb8Az0HN2Zi"
})

module.exports = {
    query: (QueryString, params, callBack) => {
        return conn.query(QueryString, params, callBack);
    }
}



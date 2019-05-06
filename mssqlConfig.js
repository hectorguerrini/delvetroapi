var sql = require('mssql')

const configDev = {
    user: 'node',
    password: 'nodeadmin',
    server: 'AIRFORCEONE\\SQLEXPRESS01', // You can use 'localhost\\instance' to connect to named instance
    database: 'del_vetro',
    parseJSON: true,    
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

module.exports = function () {

    let response = {}

    response.queryDB = function (query, callback) {
        const pool = new sql.ConnectionPool(configDev, function (err) {
            if (err) {
                console.error("error connecting: " + err.stack);
                callback(true);
            }

            var conn = new sql.Request(pool);
            conn.query(query, function (error, result) {

                if (error) {
                    console.dir(error);
                    callback(true);
                } else {
                    callback(false, result.recordset);
                }
            });
        });
    };
    return response;
}
const querySql = require('./mssqlConfig')();
var sql = require('mssql');

exports.fechamento = function(req, res){
    let query = `
        
    `;

    querySql.queryDB(query, (err, result) => {
        if (err) {
            console.dir(err);
            return;
        }
        res.json({
            string: query,
            jsonRetorno: result
        });
    });

}
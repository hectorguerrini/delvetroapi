var Firebird = require('node-firebird');
var options = {};
options.host = '192.168.98.254';
options.port = 3050;
options.database = 'C:\\Sorio\\Gevitro4u\\Dados\\DBEMPRESA.FDB';
// options.user = 'SYSDBA';
// options.password = 'MASTERKEY';
options.role = null;            // default


module.exports = function(){
    var fire = {}
    fire.Execute = function(query, callback){
        Firebird.attach(options, function(err, db) {
 
            if (err)
                throw err;
         
            
            db.query(query, function(err, result) {                
                if(err){                    
                    throw err;
                }
                    
                // IMPORTANT: close the connection
                db.detach();
                callback(result);
            });
         
        });
    }

    return fire;
};
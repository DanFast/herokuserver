var mysql   = require('mysql'),
    dbconfig  = require("./dbconfig");

/*
 * @sqlConnection
 * Creates the connection, makes the query and close it to avoid concurrency conflicts.
 */

var sqlConnection = function sqlConnection(sql, date, userLocLat, userLocLong, slideLocLat,slideLocLong, title,img_path, userId , res) {

    //Connetct to DB
    var connection = mysql.createConnection(dbconfig.db);
    var LId = null;
    connection.connect(function(err) {
        if (err !== null) {
            console.log("[MYSQL] Error connecting to mysql:" + err.stack+'\n');
            return;
        }
        console.log('Connected to DB as id ' + connection.threadId);
    });

    connection.query(sql,[LId, date, userLocLat, userLocLong, slideLocLat,slideLocLong, title, img_path, userId],(err, result) => {
        if(err){
            throw err;
        }else{
        console.log("This is result: " + JSON.stringify(result));
        connection.end(); // close the connection
        res.send(result);}
    });

}

module.exports = sqlConnection;
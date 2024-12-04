var mysql = require('mysql');

// Create database connection
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: ""
});

// Connect to MySQL and create the database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Create the database
    con.query("CREATE DATABASE library", function(err, result) {
        if (err && err.code !== 'ER_DB_CREATE_EXISTS') throw err;
        if (result) console.log("Database created!");
        else console.log("Database already exists!");
    });
});

module.exports = con;

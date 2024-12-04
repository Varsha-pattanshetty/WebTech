const mysql = require('mysql');

// Create a connection to MySQL
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: ""
});

// Connect to MySQL and create the database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Create the blog database
    const sql = "CREATE DATABASE IF NOT EXISTS blog";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database 'blog' created or already exists.");
        con.end();
    });
});

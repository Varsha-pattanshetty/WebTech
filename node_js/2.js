var mysql = require('mysql');

// Connect to the 'library' database
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "library"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the 'library' database!");

    // Create the authors table
    var authorsTable = `
        CREATE TABLE IF NOT EXISTS authors (
            author_id INT AUTO_INCREMENT PRIMARY KEY,
            author_name VARCHAR(100) NOT NULL,
            author_bio TEXT
        )`;
    con.query(authorsTable, function(err, result) {
        if (err) throw err;
        console.log("Authors table created!");
    });

    // Create the books table
    var booksTable = `
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author_id INT,
            published_year YEAR,
            quantity_available INT,
            FOREIGN KEY (author_id) REFERENCES authors(author_id)
        )`;
    con.query(booksTable, function(err, result) {
        if (err) throw err;
        console.log("Books table created!");
    });
});

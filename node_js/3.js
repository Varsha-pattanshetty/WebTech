const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "library"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the library database!");
});

// Home Page with Forms
app.get('/', (req, res) => {
    const html = `
        <h1>Library Management System</h1>
        <h2>Add a New Book</h2>
        <form action="/addbooks" method="POST">
            Title: <input type="text" name="title" required><br>
            Author Name: <input type="text" name="author_name" required><br>
            Published Year: <input type="number" name="published_year" required><br>
            Quantity Available: <input type="number" name="quantity_available" required><br>
            <button type="submit">Add Book</button>
        </form>
        
        <h2>Update Book Quantity</h2>
        <form action="/updatebooks" method="POST">
            Book ID: <input type="number" name="id" required><br>
            New Quantity: <input type="number" name="quantity_available" required><br>
            <button type="submit">Update Quantity</button>
        </form>
        
        <h2>Delete a Book</h2>
        <form action="/deletebooks" method="POST">
            Book ID: <input type="number" name="id" required><br>
            <button type="submit">Delete Book</button>
        </form>

        <h2>View All Books</h2>
        <form action="/books" method="GET">
            <button type="submit">View Books</button>
        </form>
    `;
    res.send(html);
});

// Retrieve the list of all books with authors
app.get('/books', function (req, res) {
    const sql = `
        SELECT b.id, b.title, a.author_name, b.published_year, b.quantity_available
        FROM books b
        JOIN authors a ON b.author_id = a.author_id;
    `;
    con.query(sql, function (err, results) {
        if (err) {
            console.error("Error fetching books:", err);
            return res.status(500).send("Error fetching books.");
        }

        let html = `<h1>All Books</h1><table border="1"><tr><th>ID</th><th>Title</th><th>Author</th><th>Published Year</th><th>Quantity</th></tr>`;
        results.forEach(book => {
            html += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author_name}</td><td>${book.published_year}</td><td>${book.quantity_available}</td></tr>`;
        });
        html += `</table><a href="/">Go Back</a>`;
        res.send(html);
    });
});

// Add a new book to the inventory
app.post('/addbooks', function (req, res) {
    const { title, author_name, published_year, quantity_available } = req.body;

    if (!title || !author_name || !published_year || !quantity_available) {
        return res.status(400).send("All fields are required.");
    }

    const findAuthorSql = `SELECT author_id FROM authors WHERE author_name = ?`;
    con.query(findAuthorSql, [author_name], function (err, results) {
        if (err) {
            console.error("Error checking author:", err);
            return res.status(500).send("Error checking author.");
        }

        if (results.length > 0) {
            const author_id = results[0].author_id;
            const addBookSql = `
                INSERT INTO books (title, author_id, published_year, quantity_available)
                VALUES (?, ?, ?, ?)
            `;
            con.query(addBookSql, [title, author_id, published_year, quantity_available], function (err) {
                if (err) {
                    console.error("Error adding book:", err);
                    return res.status(500).send("Error adding book.");
                }
                res.send(`<h1>Book added successfully.</h1><a href="/">Go Back</a>`);
            });
        } else {
            const addAuthorSql = `INSERT INTO authors (author_name) VALUES (?)`;
            con.query(addAuthorSql, [author_name], function (err, result) {
                if (err) {
                    console.error("Error adding author:", err);
                    return res.status(500).send("Error adding author.");
                }

                const author_id = result.insertId;
                const addBookSql = `
                    INSERT INTO books (title, author_id, published_year, quantity_available)
                    VALUES (?, ?, ?, ?)
                `;
                con.query(addBookSql, [title, author_id, published_year, quantity_available], function (err) {
                    if (err) {
                        console.error("Error adding book:", err);
                        return res.status(500).send("Error adding book.");
                    }
                    res.send(`<h1>Book and author added successfully.</h1><a href="/">Go Back</a>`);
                });
            });
        }
    });
});

// Update the quantity available for a specific book
app.post('/updatebooks', function (req, res) {
    const { id, quantity_available } = req.body;

    const sql = `UPDATE books SET quantity_available = ? WHERE id = ?`;
    con.query(sql, [quantity_available, id], function (err, result) {
        if (err) {
            console.error("Error updating quantity:", err);
            return res.status(500).send("Error updating quantity.");
        }
        if (result.affectedRows === 0) {
            res.status(404).send(`<h1>Book not found.</h1><a href="/">Go Back</a>`);
        } else {
            res.send(`<h1>Book quantity updated successfully.</h1><a href="/">Go Back</a>`);
        }
    });
});

// Delete a book by its ID
app.post('/deletebooks', function (req, res) {
    const { id } = req.body;

    const sql = `DELETE FROM books WHERE id = ?`;
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.error("Error deleting book:", err);
            return res.status(500).send("Error deleting book.");
        }
        if (result.affectedRows === 0) {
            res.status(404).send(`<h1>Book not found.</h1><a href="/">Go Back</a>`);
        } else {
            res.send(`<h1>Book deleted successfully.</h1><a href="/">Go Back</a>`);
        }
    });
});

// Start the server
app.listen(9000, function () {
    console.log("Server is running on http://localhost:9000");
});

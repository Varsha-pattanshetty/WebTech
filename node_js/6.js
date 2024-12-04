const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "blog"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the blog database!");
});

// 1. Retrieve the latest 5 blog posts with the username of the creator
app.get('/latest-posts', (req, res) => {
    const sql = `
        SELECT p.post_id, p.title, p.content, p.created_at, u.username
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        ORDER BY p.created_at DESC
        LIMIT 5;
    `;
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching latest posts:", err);
            return res.status(500).send("Error fetching latest posts.");
        }
        res.json(results);
    });
});

// 2. Insert a new blog post into the database
app.post('/add-post', (req, res) => {
    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
        return res.status(400).send("All fields are required: title, content, user_id.");
    }

    const sql = `
        INSERT INTO posts (title, content, user_id, created_at)
        VALUES (?, ?, ?, NOW());
    `;
    con.query(sql, [title, content, user_id], (err, result) => {
        if (err) {
            console.error("Error adding post:", err);
            return res.status(500).send("Error adding post.");
        }
        res.send("Post added successfully.");
    });
});

// 3. Serve the form for adding a new post and handle requests
app.get('/add-post', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Add a New Post</title>
        </head>
        <body>
            <h1>Add a New Blog Post</h1>
            <form action="/add-post" method="POST">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required><br><br>

                <label for="content">Content:</label>
                <textarea id="content" name="content" required></textarea><br><br>

                <label for="user_id">User ID:</label>
                <input type="number" id="user_id" name="user_id" required><br><br>

                <button type="submit">Add Post</button>
            </form>
        </body>
        </html>
    `);
});

// Start the server
app.listen(9000, () => {
    console.log("Server is running on http://localhost:9000");
});

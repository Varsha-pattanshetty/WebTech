const mysql = require('mysql');

// Create a connection to the blog database
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "blog"
});

// Connect to the blog database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the 'blog' database!");

    // Create the users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE
        );
    `;
    con.query(createUsersTable, function (err) {
        if (err) throw err;
        console.log("Users table created or already exists.");

        // Create the posts table
        const createPostsTable = `
            CREATE TABLE IF NOT EXISTS posts (
                post_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `;
        con.query(createPostsTable, function (err) {
            if (err) throw err;
            console.log("Posts table created or already exists.");

            // Create the comments table
            const createCommentsTable = `
                CREATE TABLE IF NOT EXISTS comments (
                    comment_id INT AUTO_INCREMENT PRIMARY KEY,
                    post_id INT NOT NULL,
                    user_id INT NOT NULL,
                    comment_text TEXT NOT NULL,
                    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                );
            `;
            con.query(createCommentsTable, function (err) {
                if (err) throw err;
                console.log("Comments table created or already exists.");
                con.end();
            });
        });
    });
});

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

const app = express();
const PORT = 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "course_feedback1",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL!");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve login page at root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Route: Student Feedback Submission
app.post("/student", (req, res) => {
    const { courseName, courseCode, faculty, rating } = req.body;

    const query = "INSERT INTO courses (courseName, courseCode, faculty, rating) VALUES (?, ?, ?, ?)";
    db.query(query, [courseName, courseCode, faculty, rating], (err) => {
        if (err) {
            console.error("Error saving feedback:", err);
            res.status(500).send("Error saving feedback.");
        } else {
            res.redirect("/student.html");
        }
    });
});

// Route: Faculty View - Display All Courses
app.get("/faculty-data", (req, res) => {
    const query = "SELECT * FROM courses";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving courses:", err);
            res.status(500).send("Error retrieving courses.");
        } else {
            let tableData = results
                .map(
                    (course) => `
                    <tr>
                        <td>${course.courseName}</td>
                        <td>${course.courseCode}</td>
                        <td>${course.faculty}</td>
                        <td>${course.rating}</td>
                    </tr>
                `
                )
                .join("");

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Faculty View</title>
                </head>
                <body>
                    <h1>Courses</h1>
                    <table border="1">
                        <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Faculty</th>
                            <th>Rating</th>
                        </tr>
                        ${tableData}
                    </table>
                    <a href="/login.html">Back to Login</a>
                </body>
                </html>
            `);
        }
    });
});

// Route: Display Page - Sorted by Ratings
app.get("/display-data", (req, res) => {
    const query = "SELECT * FROM courses ORDER BY rating DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving courses:", err);
            res.status(500).send("Error retrieving courses.");
        } else {
            let tableData = results
                .map(
                    (course) => `
                    <tr>
                        <td>${course.courseName}</td>
                        <td>${course.courseCode}</td>
                        <td>${course.faculty}</td>
                        <td>${course.rating}</td>
                    </tr>
                `
                )
                .join("");

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Display Sorted Ratings</title>
                </head>
                <body>
                    <h1>Courses Sorted by Ratings</h1>
                    <table border="1">
                        <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Faculty</th>
                            <th>Rating</th>
                        </tr>
                        ${tableData}
                    </table>
                    <a href="/login.html">Back to Login</a>
                </body>
                </html>
            `);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});

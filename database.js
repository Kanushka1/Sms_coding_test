const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Create a new database or open an existing one
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Define route to display users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error retrieving users:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(`
                <html>
                <head>
                    <title>Users</title>
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Users</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id}</td>
                                <td>${row.name}</td>
                                <td>${row.email}</td>
                            </tr>`).join('')}
                    </table>
                </body>
                </html>
            `);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const sqlite3 = require('sqlite3').verbose();

// Create a new database or open an existing one
// const db = new sqlite3.Database('./data.db', (err) => {
    // if (err) {
    //     console.error('Error opening database:', err.message);
    // } else {
    //     console.log('Connected to the database.');
    // }
// });

// module.exports = db;

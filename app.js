const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

// Create a new database or open an existing one
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
        // Create tables if they don't exist
        createTables();
    }
});

// Function to create tables
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created successfully.');
            // Retrieve and display users
            displayUsers();
            // Start command line interface for user input
            startCLI();
        }
    });

    // Add more tables (companies, clients, etc.) here if needed
}

// Function to retrieve and display users
function displayUsers() {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error retrieving users:', err.message);
        } else {
            console.log('Users:');
            rows.forEach(row => {
                console.log(`${row.id}: ${row.name} (${row.email})`);
            });
        }
    });
}

// Function to add a user
function addUser(name, email) {
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) {
            console.error('Error adding user:', err.message);
        } else {
            console.log('User added successfully.');
            displayUsers();
        }
    });
}

// Function to delete a user by email
function deleteUser(email) {
    db.run('DELETE FROM users WHERE email = ?', email, (err) => {
        if (err) {
            console.error('Error deleting user:', err.message);
        } else {
            console.log('User deleted successfully.');
            displayUsers();
        }
    });
}

// Function to start command line interface for user input
function startCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter user name: ', (name) => {
        rl.question('Enter email address: ', (email) => {
            addUser(name, email);
            rl.close();
        });
    });
}

// Close the database connection when done
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
            process.exit(0);
        }
    });
});


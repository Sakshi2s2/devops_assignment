const express = require('express');
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express();
const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'db', // Docker service name for the database
    database: 'Devops_Assignment',
    password: 'S@kshi1969', // Replace with your PostgreSQL password
    port: 5432,
});

// Middleware
app.use(express.json());

// Routes

// Create: Add a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).send({ message: 'User added successfully', user: result.rows[0] });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Read: Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update: Modify a user by ID
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        if (result.rows.length === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ message: 'User updated successfully', user: result.rows[0] });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ message: 'User deleted successfully', user: result.rows[0] });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Ensure the "users" table exists
const initializeDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table is ready.');
    } catch (error) {
        console.error('Error initializing database:', error.message);
    }
};

// Initialize the database
initializeDb();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

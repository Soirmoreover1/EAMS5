const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); // Import promise-based version of mysql2

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "eams"
});

// Get a connection from the pool
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error("Error getting database connection:", error.message);
        throw error;
    }
};

module.exports = {
    getConnection
};

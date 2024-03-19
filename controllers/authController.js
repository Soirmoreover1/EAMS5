const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const db = require('../db');

const signup = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const connection = await db.getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = 'INSERT INTO account (username, password, role) VALUES (?, ?, ?)';
        const [result] = await connection.query(insertUserQuery, [username, hashedPassword, role]);
        connection.release();
        res.json({ message: 'User inserted successfully' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Failed to sign up user' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const connection = await db.getConnection();
        const getUserQuery = 'SELECT * FROM account WHERE username = ?';
        const [results] = await connection.query(getUserQuery, [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '100h' });
        res.cookie('token', token, { httpOnly: true });
        connection.release();
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};
const logout = (req, res) => {
    try {
        // Clear the token cookie on logout
        res.clearCookie('token');
        res.status(204).send("Logout successfully");
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Failed to log out' });
    }
};

module.exports = {
    signup,
    login,
    logout,
};

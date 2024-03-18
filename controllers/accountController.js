const db = require('../db');

// Create an account
const createAccount = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const connection = await db.getConnection();
    const createAccountQuery = 'INSERT INTO account (Username, Password, Role) VALUES (?, ?, ?)';
    const result = await connection.query(createAccountQuery, [username, password, role]);
    connection.release();

    res.status(201).json({ message: 'Account created successfully', accountId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const connection = await db.getConnection();

    const getAllAccountsQuery = 'SELECT * FROM account';
    const accounts = await connection.query(getAllAccountsQuery);
    connection.release();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an account by ID
const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const connection = await db.getConnection();

    const getAccountQuery = 'SELECT * FROM account WHERE id = ?';
    const [account] = await connection.query(getAccountQuery, [accountId]);
    connection.release();
    if (!account.length) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.status(200).json(account[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an account
const updateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const { username, password, role } = req.body;
    const connection = await db.getConnection();

    const updateAccountQuery = 'UPDATE account SET Username = ?, Password = ?, Role = ? WHERE id = ?';
    await connection.query(updateAccountQuery, [username, password, role, accountId]);
    connection.release();
    res.status(200).json({ message: 'Account updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an account
const deleteAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const connection = await db.getConnection();

    const deleteAccountQuery = 'DELETE FROM account WHERE id = ?';
    await connection.query(deleteAccountQuery, [accountId]);
    connection.release();
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount
};

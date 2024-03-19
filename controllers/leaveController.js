const db = require('../db');

// Create a new leave
const createLeave = async (req, res) => {
  try {
    const { employeeid, type_of_leave, start_date, end_date, duration } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO `leave` (employeeid, type_of_leave, start_date, end_date, duration) VALUES (?, ?, ?, ?, ?)', [employeeid, type_of_leave, start_date, end_date, duration]);
    const leave = await connection.query('SELECT * FROM `leave` WHERE id = ?', [result.insertId]);
    connection.release();
    res.status(201).json({ message: 'Leave created successfully', leave: leave[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const leaves = await connection.query('SELECT * FROM `leave`');
    connection.release();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a leave by ID
const getLeaveById = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const leave = await connection.query('SELECT * FROM `leave` WHERE id = ?', [req.params.id]);
    connection.release();
    if (!leave.length) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.status(200).json(leave[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a leave
const updateLeave = async (req, res) => {
  try {
    const { employeeid, type_of_leave, start_date, end_date, duration } = req.body;
    const connection = await db.getConnection();
    await connection.query('UPDATE `leave` SET employeeid = ?, type_of_leave = ?, start_date = ?, end_date = ?, duration = ? WHERE id = ?', [employeeid, type_of_leave, start_date, end_date, duration, req.params.id]);
    const updatedLeave = await connection.query('SELECT * FROM `leave` WHERE id = ?', [req.params.id]);
    connection.release();
    if (!updatedLeave.length) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.status(200).json({ message: 'Leave updated successfully', leave: updatedLeave[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a leave
const deleteLeave = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM `leave` WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.status(204).json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave
};

const db = require('../db');

// Create a new shift
const createShift = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { name, start_time, end_time, working_days } = req.body;
    const result = await connection.query('INSERT INTO shift (name, start_time, end_time, working_days) VALUES (?, ?, ?, ?)', [name, start_time, end_time, working_days]);
    const shift = await connection.query('SELECT * FROM shift WHERE id = ?', [result.insertId]);
    res.status(201).json(shift[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get all shifts
const getAllShifts = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const shifts = await connection.query('SELECT * FROM shift');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get a shift by ID
const getShiftById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const shift = await connection.query('SELECT * FROM shift WHERE id = ?', [req.params.id]);
    if (!shift.length) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json(shift[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Update a shift
const updateShift = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { name, start_time, end_time, working_days } = req.body;
    await connection.query('UPDATE shift SET name = ?, start_time = ?, end_time = ?, working_days = ? WHERE id = ?', [name, start_time, end_time, working_days, req.params.id]);
    const updatedShift = await connection.query('SELECT * FROM shift WHERE id = ?', [req.params.id]);
    if (!updatedShift.length) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json(updatedShift[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Delete a shift
const deleteShift = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM shift WHERE id = ?', [req.params.id]);
    if (deleted.affectedRows ===0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift
};

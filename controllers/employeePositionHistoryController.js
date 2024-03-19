const db = require('../db');

// Create a new employee position history
const createEmployeePositionHistory = async (req, res) => {
  try {
    const { employeeid, position, departmentid, salaryid, start_date, end_date } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO employeepositionhistory (employeeid, position, departmentid, salaryid, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)', [employeeid, position, departmentid, salaryid, start_date, end_date]);
    const employeePositionHistory = await connection.query('SELECT * FROM employeepositionhistory WHERE id = ?', [result.insertId]);
    connection.release();
    res.status(201).json({ message: 'Employee position history created successfully', employeePositionHistory: employeePositionHistory[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee position history
const updateEmployeePositionHistory = async (req, res) => {
  try {
    const { employeeid, position, departmentid, salaryid, start_date, end_date } = req.body;
    const connection = await db.getConnection();
    await connection.query('UPDATE employeepositionhistory SET employeeid = ?, position = ?, departmentid = ?, salaryid = ?, start_date = ?, end_date = ? WHERE id = ?', [employeeid, position, departmentid, salaryid, start_date, end_date, req.params.id]);
    const updatedEmployeePositionHistory = await connection.query('SELECT * FROM employeepositionhistory WHERE id = ?', [req.params.id]);
    connection.release();
    if (!updatedEmployeePositionHistory.length) {
      return res.status(404).json({ message: 'Employee position history not found' });
    }
    res.status(200).json({ message: 'Employee position history updated successfully', updatedEmployeePositionHistory: updatedEmployeePositionHistory[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all employee position history
const getAllEmployeePositionHistory = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const employeePositionHistory = await connection.query('SELECT * FROM employeepositionhistory');
    connection.release();
    res.status(200).json(employeePositionHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee position history by ID
const getEmployeePositionHistoryById = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const employeePositionHistory = await connection.query('SELECT * FROM employeepositionhistory WHERE id = ?', [req.params.id]);
    connection.release();
    if (!employeePositionHistory.length) {
      return res.status(404).json({ message: 'Employee position history not found' });
    }
    res.status(200).json(employeePositionHistory[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee position history
const deleteEmployeePositionHistory = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM employeepositionhistory WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee position history not found' });
    }
    res.status(204).json({ message: 'Employee position history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployeePositionHistory,
  getAllEmployeePositionHistory,
  getEmployeePositionHistoryById,
  updateEmployeePositionHistory,
  deleteEmployeePositionHistory
};



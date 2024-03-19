const db = require('../db');

// Create a new attendance record
const createAttendance = async (req, res) => {
  try {
    const { employeeid, date, time_in, time_out, total_hours_working, overtime_hours } = req.body;
    
    const connection = await db.getConnection();
    const createAttendanceQuery = `
      INSERT INTO attendance (employeeid, date, time_in, time_out, total_hours_working, overtime_hours)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.query(createAttendanceQuery, [employeeid, date, time_in, time_out, total_hours_working, overtime_hours]);
    connection.release();

    res.status(201).json({ message: 'Attendance record created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const getAllAttendanceQuery = 'SELECT * FROM attendance';
    const [attendance] = await connection.query(getAllAttendanceQuery);
    connection.release();

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an attendance record by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    
    const connection = await db.getConnection();
    const getAttendanceByIdQuery = 'SELECT * FROM attendance WHERE id = ?';
    const [attendance] = await connection.query(getAttendanceByIdQuery, [attendanceId]);
    connection.release();

    if (!attendance.length) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(attendance[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an attendance record
const updateAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const { employeeid, date, time_in, time_out, total_hours_working, overtime_hours } = req.body;
    
    const connection = await db.getConnection();
    const updateAttendanceQuery = `
      UPDATE attendance
      SET employeeid = ?, date = ?, time_in = ?, time_out = ?, total_hours_working = ?, overtime_hours = ?
      WHERE id = ?
    `;
    await connection.query(updateAttendanceQuery, [employeeid, date, time_in, time_out, total_hours_working, overtime_hours, attendanceId]);
    connection.release();

    res.status(200).json({ message: 'Attendance record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    
    const connection = await db.getConnection();
    const deleted =await connection.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};

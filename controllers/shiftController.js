const db = require('../db');

// Create a new shift
const createShift = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { name, start_time, end_time, working_days } = req.body;
    const result = await connection.query('INSERT INTO shift (name, start_time, end_time, working_days) VALUES (?, ?, ?, ?)', [name, start_time, end_time, working_days]);
    const shift = await connection.query('SELECT * FROM shift WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Shift created successfully', shift: shift[0] });
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
    res.status(200).json({ message: 'Shift updated successfully', shift: updatedShift[0] });
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



// Delete a shift
// Delete a shift
const deleteShift = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM shift WHERE id = ?', [req.params.id]);
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(204).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
// Search shifts by name and get employees, departments, and companies
const searchShifts = async (req, res) => {
  let connection;
  try {
    const { name } = req.query;
    connection = await db.getConnection();
    const shifts = await connection.query(`
      SELECT 
        s.name AS shift_name, 
        e.name AS employee_name, 
        d.name AS department_name, 
        c.name AS company_name
      FROM 
        shift s
      LEFT JOIN 
        employee e ON s.id = e.shiftid
      LEFT JOIN 
        department d ON e.departmentid = d.id
      LEFT JOIN 
        companies c ON d.companyid = c.id
      WHERE 
        s.name LIKE ?`, [`%${name}%`]);

    if (!shifts.length) {
      return res.status(404).json({ message: 'No shifts found' });
    }

    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};




const getShiftEmployees = async (req, res) => {
  const { shiftId } = req.params;
  try {
    const connection = await db.getConnection();
    const [employees] = await connection.query(`
      SELECT 
        e.id, 
        e.name, 
        e.hire_date, 
        e.image, 
        d.name AS department_name, 
        s.name AS shift_name
      FROM 
        employee e
      INNER JOIN 
        department d ON e.departmentid = d.id
      INNER JOIN 
        shift s ON e.shiftid = s.id
      WHERE 
        e.shiftid = ?
    `, [shiftId]);
    connection.release();
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found for this shift' });
    }
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift,
  searchShifts,
  getShiftEmployees

};

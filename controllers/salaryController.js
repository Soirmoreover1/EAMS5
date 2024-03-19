const db = require('../db');

// Create a new salary record
const createSalary = async (req, res) => {
  try {
    const { employeeid, gross_salary, net_salary, date } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO salary (employeeid, gross_salary, net_salary, date) VALUES (?, ?, ?, ?)', [employeeid, gross_salary, net_salary, date]);
    const salary = await connection.query('SELECT * FROM salary WHERE id = ?', [result.insertId]);
    connection.release();
    res.status(201).json(salary[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a salary record
const updateSalary = async (req, res) => {
  try {
    const { employeeid, gross_salary, net_salary, date } = req.body;
    const connection = await db.getConnection();
    await connection.query('UPDATE salary SET employeeid = ?, gross_salary = ?, net_salary = ?, date = ? WHERE id = ?', [employeeid, gross_salary, net_salary, date, req.params.id]);
    const updatedSalary = await connection.query('SELECT * FROM salary WHERE id = ?', [req.params.id]);
    connection.release();
    if (!updatedSalary.length) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.status(200).json({ message: 'Salary record updated successfully', updatedSalary: updatedSalary[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a salary record
const deleteSalary = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM salary WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.status(204).json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all salary records
const getAllSalaries = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const salaries = await connection.query('SELECT * FROM salary');
    connection.release();
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a salary record by ID
const getSalaryById = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const salary = await connection.query('SELECT * FROM salary WHERE id = ?', [req.params.id]);
    connection.release();
    if (!salary.length) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.status(200).json(salary[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createSalary,
  getAllSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary
};

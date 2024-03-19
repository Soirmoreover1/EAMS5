const db = require('../db');

// Create a new deduction record
const createDeduction = async (req, res) => {
  try {
    const { employeeid, deduction_type, deduction_amount, date } = req.body;
    
    const connection = await db.getConnection();
    const createDeductionQuery = `
      INSERT INTO deduction (employeeid, deduction_type, deduction_amount, date)
      VALUES (?, ?, ?, ?)
    `;
    await connection.query(createDeductionQuery, [employeeid, deduction_type, deduction_amount, date]);
    connection.release();

    res.status(201).json({ message: 'Deduction record created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all deduction records
const getAllDeductions = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const getAllDeductionsQuery = 'SELECT * FROM deduction';
    const deductions = await connection.query(getAllDeductionsQuery);
    connection.release();

    res.status(200).json(deductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a deduction record by ID
const getDeductionById = async (req, res) => {
  try {
    const deductionId = req.params.id;
    
    const connection = await db.getConnection();
    const getDeductionByIdQuery = 'SELECT * FROM deduction WHERE id = ?';
    const [deduction] = await connection.query(getDeductionByIdQuery, [deductionId]);
    connection.release();

    if (!deduction.length) {
      return res.status(404).json({ message: 'Deduction record not found' });
    }

    res.status(200).json(deduction[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a deduction record
const updateDeduction = async (req, res) => {
  try {
    const deductionId = req.params.id;
    const { employeeid, deduction_type, deduction_amount, date } = req.body;
    
    const connection = await db.getConnection();
    const updateDeductionQuery = `
      UPDATE deduction
      SET employeeid = ?, deduction_type = ?, deduction_amount = ?, date = ?
      WHERE id = ?
    `;
    await connection.query(updateDeductionQuery, [employeeid, deduction_type, deduction_amount, date, deductionId]);
    connection.release();

    res.status(200).json({ message: 'Deduction record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a deduction record
const deleteDeduction = async (req, res) => {
  try {
    
    const connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM deduction WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(204).json({ message: 'Deduction record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createDeduction,
  getAllDeductions,
  getDeductionById,
  updateDeduction,
  deleteDeduction,
};

const db = require('../db');

// Create a new promotion
const createPromotion = async (req, res) => {
  try {
    const { employeeid, date, prev_position, new_position, salary_increasing } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO promotion (employeeid, date, prev_position, new_position, salary_increasing) VALUES (?, ?, ?, ?, ?)', [employeeid, date, prev_position, new_position, salary_increasing]);
    const promotion = await connection.query('SELECT * FROM promotion WHERE id = ?', [result.insertId]);
    connection.release();
    res.status(201).json({ message: 'Promotion created successfully', promotion: promotion[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all promotions
const getAllPromotions = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const promotions = await connection.query('SELECT * FROM promotion');
    connection.release();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a promotion by ID
const getPromotionById = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const promotion = await connection.query('SELECT * FROM promotion WHERE id = ?', [req.params.id]);
    connection.release();
    if (!promotion.length) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(promotion[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promotion
const updatePromotion = async (req, res) => {
  try {
    const { employeeid, date, prev_position, new_position, salary_increasing } = req.body;
    const connection = await db.getConnection();
    await connection.query('UPDATE promotion SET employeeid = ?, date = ?, prev_position = ?, new_position = ?, salary_increasing = ? WHERE id = ?', [employeeid, date, prev_position, new_position, salary_increasing, req.params.id]);
    const updatedPromotion = await connection.query('SELECT * FROM promotion WHERE id = ?', [req.params.id]);
    connection.release();
    if (!updatedPromotion.length) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json({ message: 'Promotion updated successfully', promotion: updatedPromotion[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a promotion
const deletePromotion = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const deleted = await connection.query('DELETE FROM promotion WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(204).json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
};

const db = require('../db');

// Create a new bonus record
const createBonus = async (req, res) => {
  try {
    const { employeeid, bonus_type, bonus_amount, date } = req.body;
    
    const connection = await db.getConnection();
    const createBonusQuery = `
      INSERT INTO bonus (employeeid, bonus_type, bonus_amount, date)
      VALUES (?, ?, ?, ?)
    `;
    await connection.query(createBonusQuery, [employeeid, bonus_type, bonus_amount, date]);
    connection.release();

    res.status(201).json({ message: 'Bonus record created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bonus records
const getAllBonus = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const getAllBonusQuery = 'SELECT * FROM bonus';
    const bonus = await connection.query(getAllBonusQuery);
    connection.release();

    res.status(200).json(bonus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a bonus record by ID
const getBonusById = async (req, res) => {
  try {
    const bonusId = req.params.id;
    
    const connection = await db.getConnection();
    const getBonusByIdQuery = 'SELECT * FROM bonus WHERE id = ?';
    const [bonus] = await connection.query(getBonusByIdQuery, [bonusId]);
    connection.release();

    if (!bonus.length) {
      return res.status(404).json({ message: 'Bonus record not found' });
    }

    res.status(200).json(bonus[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bonus record
const updateBonus = async (req, res) => {
  try {
    const bonusId = req.params.id;
    const { employee_id, bonus_type, bonus_amount, date } = req.body;
    
    const connection = await db.getConnection();
    const updateBonusQuery = `
      UPDATE bonus
      SET employeeid = ?, bonus_type = ?, bonus_amount = ?, date = ?
      WHERE id = ?
    `;
    await connection.query(updateBonusQuery, [employee_id, bonus_type, bonus_amount, date, bonusId]);
    connection.release();

    res.status(200).json({ message: 'Bonus record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a bonus record
const deleteBonus = async (req, res) => {
  try {
    
    const connection = await db.getConnection();
   const deleted= await connection.query('DELETE FROM bonus WHERE id = ?', [req.params.id]);
    connection.release();
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(204).json({ message: 'Bonus record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createBonus,
  getAllBonus,
  getBonusById,
  updateBonus,
  deleteBonus,
};

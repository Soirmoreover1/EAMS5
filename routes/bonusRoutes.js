// bonusRoutes.js

const express = require('express');
const router = express.Router();
const bonusController = require('../controllers/bonusController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateBonus } = require('../middlewares/validationMiddleware');

// Create a new bonus record
router.post('/create', validateCreateBonus,bonusController.createBonus);

// Get all bonus records
router.get('/showbonus', bonusController.getAllBonus);

// Get a bonus record by ID
router.get('/showbonus/:id', bonusController.getBonusById);

// Update a bonus record
router.put('/edit/:id', bonusController.updateBonus);

// Delete a bonus record
router.delete('/delete/:id', bonusController.deleteBonus);

module.exports = router;

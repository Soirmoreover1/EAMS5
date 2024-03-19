// deductionRoutes.js

const express = require('express');
const router = express.Router();
const deductionController = require('../controllers/deductionController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateDeduction } = require('../middlewares/validationMiddleware');

// Create a new deduction record
router.post('/create',validateCreateDeduction, deductionController.createDeduction);

// Get all deduction records
router.get('/showdeductions', deductionController.getAllDeductions);

// Get a deduction record by ID
router.get('/showdeductions/:id', deductionController.getDeductionById);

// Update a deduction record
router.put('/edit/:id',deductionController.updateDeduction);

// Delete a deduction record
router.delete('/delete/:id', deductionController.deleteDeduction);

module.exports = router;

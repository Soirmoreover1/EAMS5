// salaryRoutes.js

const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateSalary} = require('../middlewares/validationMiddleware');
// Create a new salary record
router.post('/create', validateCreateSalary,salaryController.createSalary);

// Get all salary records
router.get('/showsalaries', salaryController.getAllSalaries);

// Get a salary record by ID
router.get('/showsalaries/:id', salaryController.getSalaryById);

// Update a salary record
router.put('/edit/:id', salaryController.updateSalary);

// Delete a salary record
router.delete('/delete/:id', salaryController.deleteSalary);

module.exports = router;

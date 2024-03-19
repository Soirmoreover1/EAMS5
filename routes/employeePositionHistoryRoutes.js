// employeePositionHistoryRoutes.js

const express = require('express');
const router = express.Router();
const employeepositionhistoryController = require('../controllers/employeePositionHistoryController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateEmployeePositionHistory } = require('../middlewares/validationMiddleware');

// Create a new employee position history
router.post('/create', validateCreateEmployeePositionHistory,employeepositionhistoryController.createEmployeePositionHistory);

// Get all employee position history
router.get('/showemployeepositionhistory', employeepositionhistoryController.getAllEmployeePositionHistory);

// Get employee position history by ID
router.get('/showemployeepositionhistory/:id', employeepositionhistoryController.getEmployeePositionHistoryById);

// Update an employee position history
router.put('/edit/:id', employeepositionhistoryController.updateEmployeePositionHistory);

// Delete an employee position history
router.delete('/delete/:id', employeepositionhistoryController.deleteEmployeePositionHistory);

module.exports = router;

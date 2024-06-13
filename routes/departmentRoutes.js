// departmentRoutes.js

const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateDepartment } = require('../middlewares/validationMiddleware');

// Create a new department
router.post('/create',validateCreateDepartment, departmentController.createDepartment);

// Get all departments
router.get('/showdepartments', departmentController.getAllDepartments);

// Get a department by ID
router.get('/showdepartments/:id', departmentController.getDepartmentById);

// Update a department
router.put('/edit/:id', departmentController.updateDepartment);

// Delete a department
router.delete('/delete/:id', departmentController.deleteDepartment);

router.get('/search', departmentController.searchDepartments);


module.exports = router;

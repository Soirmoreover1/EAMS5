// employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateEmployee } = require('../middlewares/validationMiddleware');
// Create a new employee
router.post('/create',employeeController.upload.single('image'),validateCreateEmployee, employeeController.createEmployee);

// Get all employees
router.get('/showemployees', employeeController.getAllEmployees);
//router.get('/allshowemployees', employeeController.getAllEmployeesWithDetails);

// Get an employee by ID
router.get('/showemployees/:id', employeeController.getEmployeeById);

// Update an employee
router.put('/edit/:id', employeeController.updateEmployee);

// Delete an employee
router.delete('/delete/:id', employeeController.deleteEmployee);


router.param('companyId', async (req, res, next, companyId) => {
    try {
        const employees = await employeeController.getCompanyEmployees(companyId);
        req.employees = employees;
        next(); // Proceed to the route handler
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

router.get('/:companyId', (req, res, next) => {
    res.status(200).json({ employees: req.employees });
});








module.exports = router;

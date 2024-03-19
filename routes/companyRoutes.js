// companyRoutes.js

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateCompany } = require('../middlewares/validationMiddleware');

// Create a new company
router.post('/create', validateCreateCompany,companyController.createCompany);

// Get all companies
router.get('/showcompanies', companyController.getAllCompanies);

// Get a company by ID
router.get('/showcompanies/:id', companyController.getCompanyById);

// Update a company
router.put('/edit/:id', companyController.updateCompany);

// Delete a company
router.delete('/delete/:id', companyController.deleteCompany);


router.param('employeeId', async (req, res, next, employeeId) => {
    try {
        const employeeCompany = await companyController.getEmployeeCompany(employeeId);
        req.employeeCompany = employeeCompany;
        next(); // Proceed to the route handler
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

router.get('/:employeeId', (req, res, next) => {
    res.status(200).json({ employeeCompany: req.employeeCompany });
});















module.exports = router;

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
router.put('/edit/:id',validateCreateCompany, companyController.updateCompany);

// Delete a company
router.delete('/delete/:id', companyController.deleteCompany);

module.exports = router;

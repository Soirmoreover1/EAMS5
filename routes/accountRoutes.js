const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateUser } = require('../middlewares/validationMiddleware');

// Create a new account
router.post('/accounts',validateUser, accountController.createAccount);

// Get all accounts
router.get('/accounts', accountController.getAllAccounts);

// Get an account by ID
router.get('/accounts/:id', accountController.getAccountById);

// Update an account
router.put('/accounts/:id',accountController.updateAccount);

// Delete an account
router.delete('/accounts/:id', accountController.deleteAccount);

module.exports = router;

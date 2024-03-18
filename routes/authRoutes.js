const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateUser } = require('../middlewares/validationMiddleware');


// Define route for user signup
router.post('/signup',validateUser, signup);

// Define route for user login
router.post('/login',validateUser, login);

// Define route for user logout
router.post('/logout', logout);

module.exports = router;

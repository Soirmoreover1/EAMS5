// leaveRoutes.js

const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateLeave} = require('../middlewares/validationMiddleware');

// Create a new leave
router.post('/create',validateCreateLeave, leaveController.createLeave);

// Get all leaves
router.get('/showleaves', leaveController.getAllLeaves);

// Get a leave by ID
router.get('/showleaves/:id', leaveController.getLeaveById);

// Update a leave
router.put('/edit/:id', leaveController.updateLeave);

// Delete a leave
router.delete('/delete/:id', leaveController.deleteLeave);

module.exports = router;

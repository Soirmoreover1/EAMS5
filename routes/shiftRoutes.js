// shiftRoutes.js

const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateShift} = require('../middlewares/validationMiddleware');

// Create a new shift
router.post('/create', validateCreateShift,shiftController.createShift);

// Get all shifts
router.get('/showshifts', shiftController.getAllShifts);

// Get a shift by ID
router.get('/showshifts/:id', shiftController.getShiftById);

// Update a shift
router.put('/edit/:id', shiftController.updateShift);

// Delete a shift
router.delete('/delete/:id', shiftController.deleteShift);

router.get('/shift/:shiftId', shiftController.getShiftEmployees);

router.get('/search',shiftController.searchShifts);


module.exports = router;

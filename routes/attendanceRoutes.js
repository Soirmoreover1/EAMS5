// attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreateAttendance } = require('../middlewares/validationMiddleware');
// Create a new attendance record
router.post('/create',validateCreateAttendance, attendanceController.createAttendance);

// Get all attendance records
router.get('/showattendances', attendanceController.getAllAttendance);

// Get an attendance record by ID
router.get('/showattendances/:id', attendanceController.getAttendanceById);

// Update an attendance record
router.put('/edit/:id', attendanceController.updateAttendance);

// Delete an attendance record
router.delete('/delete/:id', attendanceController.deleteAttendance);

module.exports = router;

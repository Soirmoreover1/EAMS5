const multer = require('multer');
const path = require("path");
const db = require('../db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject non-image files
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        let image = null; // Default to null if no file is uploaded
        if (req.file) {
            image = req.file.path;
        }
        const { name, departmentid, shiftid, hire_date, accountid } = req.body;
        const connection = await db.getConnection();
        const result = await connection.query('INSERT INTO employee (name, departmentid, shiftid, hire_date, image, accountid) VALUES (?, ?, ?, ?, ?, ?)', [name, departmentid, shiftid, hire_date, image, accountid]);
        const employee = await connection.query('SELECT * FROM employee WHERE id = ?', [result.insertId]);
        connection.release();
        res.status(201).json(employee[0]); // Send the created employee details in the response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const employees = await connection.query('SELECT * FROM employee');
        connection.release();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const employee = await connection.query('SELECT * FROM employee WHERE id = ?', [req.params.id]);
        connection.release();
        if (!employee.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an employee
const updateEmployee = async (req, res) => {
    try {
        let image = null; // Default to null if no file is uploaded
        if (req.file) {
            image = req.file.path;
        }
        const {name, departmentid, shiftid, hire_date,  accountid } = req.body;
        const connection = await db.getConnection();
        await connection.query('UPDATE employee SET name = ?, departmentid = ?, shiftid = ?, hire_date = ?, image = ?, accountid = ? WHERE id = ?', [name, departmentid, shiftid, hire_date, image, accountid, req.params.id]);
        const updatedEmployee = await connection.query('SELECT * FROM employee WHERE id = ?', [req.params.id]);
        connection.release();
        if (!updatedEmployee.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const deleted = await connection.query('DELETE FROM employee WHERE id = ?', [req.params.id]);
        connection.release();
        if (deleted.affectedRows===0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEmployeesWithDetails = async (req, res) => {
    try {
      const query = `
        SELECT e.*, a.username AS account_username, c.name
        FROM employee e
        LEFT JOIN account a ON e.accountid = a.id
        LEFT JOIN companies c ON e.company_id = c.id;
      `;
      const connection = await db.getConnection();

      const employeesWithDetails = await connection.query(query);
      connection.release();

      res.status(200).json(employeesWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    upload,
    getAllEmployeesWithDetails,
};

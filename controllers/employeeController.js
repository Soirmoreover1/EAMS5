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
        const { name, departmentid, shiftid, hire_date, accountid,company_id } = req.body;
        const connection = await db.getConnection();
        const result = await connection.query('INSERT INTO employee (name, departmentid, shiftid, hire_date,company_id, image, accountid) VALUES (?,?, ?, ?, ?, ?, ?)', [name, departmentid, shiftid, hire_date,company_id, image ,accountid]);
        const employee = await connection.query('SELECT * FROM employee WHERE id = ?', [result.insertId]);
        connection.release();
        res.status(201).json({ message: 'Employee created successfully', employeeId: result.insertId });
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
        const { name, departmentid, shiftid, hire_date, accountid } = req.body;
        const connection = await db.getConnection();
        const result = await connection.query('UPDATE employee SET name = ?, departmentid = ?, shiftid = ?, hire_date = ?, image = ?, accountid = ? WHERE id = ?', [name, departmentid, shiftid, hire_date, image, accountid, req.params.id]);
        const updatedEmployee = await connection.query('SELECT * FROM employee WHERE id = ?', [req.params.id]);
        connection.release();
        
        if (!updatedEmployee.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }        
        // Send success message
        res.status(200).json({ message: 'Employee updated successfully'});
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
        if (deleted.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Send success message
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


  


// Middleware to get employees of a specific company

const getCompanyEmployees = async (companyId) => {
    try {
        const connection = await db.getConnection();
        const [employees] = await connection.query(`
            SELECT 
                e.name,
                e.hire_date,
                e.image,
                d.name AS department_name, 
                s.name AS shift_name, 
                c.name AS company_name, 
                c.manager AS company_manager
            FROM 
                employee e 
            INNER JOIN 
                companies c 
            ON 
                e.company_id = c.id 
            INNER JOIN 
                department d 
            ON 
                e.departmentid = d.id 
            INNER JOIN 
                shift s 
            ON 
                e.shiftid = s.id 
            WHERE 
                e.company_id = ?`, 
            [companyId]
        );
        connection.release();
        return employees;
    } catch (error) {
        throw error;
    }
};


  







module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    upload,
    getCompanyEmployees,
};

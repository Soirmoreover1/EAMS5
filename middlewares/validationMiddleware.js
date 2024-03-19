const { check, validationResult } = require('express-validator');
const db = require('../db');

const isValidDateFormate = (value) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  return dateFormatRegex.test(value);
};

const isValidDateFormat = (value) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(value);
};

const isValidTimeFormat = (value) => {
  const timeFormatRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return timeFormatRegex.test(value);
};
exports.validateUser = [
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .custom(async (value) => {
      const connection = await db.getConnection();
      const [existinguser] = await connection.query('SELECT * FROM account WHERE username = ?', [value]);
      connection.release();
      if (existinguser.length > 0) {
          throw new Error('username is already used');
      }
      // Otherwise, return true to indicate validation success
      return true;
  }),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'g')
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateAuther = [
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'g')
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];


exports.validateCreateCompany = [
  check('name')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name must be less than or equal to 255 characters') 
    .custom(async (value) => {
      // Check if the shift name already exists in the database
      const connection = await db.getConnection();
      const [existingcompany] = await connection.query('SELECT * FROM companies WHERE name = ?', [value]);
      connection.release();
      // If the shift name already exists, return false to indicate validation failure
      if (existingcompany.length > 0) {
          throw new Error('companies name is already used');
      }
      // Otherwise, return true to indicate validation success
      return true;
  }),
  check('manager')
    .notEmpty()
    .withMessage('Manager name is required')
    .isLength({ max: 255 })
   .withMessage('Manager name must be less than or equal to 255 characters') .custom(async (value) => {
    // Check if the manager name already exists in the database
    const connection = await db.getConnection();
    const [existingcompany] = await connection.query('SELECT * FROM companies WHERE name = ?', [value]);
    connection.release();
    // If the shift name already exists, return false to indicate validation failure
    if (existingcompany.length > 0) {
        throw new Error('manager name is already used');
    }
    // Otherwise, return true to indicate validation success
    return true;
}),
  check('website')
    .notEmpty()
    .withMessage('Website is required')
    .isLength({ max: 255 })
    .withMessage('Website must be less than or equal to 255 characters'),
  check('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 255 })
    .withMessage('Location must be less than or equal to 255 characters'),
  check('industry')
    .notEmpty()
    .withMessage('Industry is required')
    .isLength({ max: 255 })
    .withMessage('Industry must be less than or equal to 255 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateShift = [
  check('name')
    .notEmpty()
    .withMessage('Shift name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Shift name must be between 3 and 255 characters')
    .custom(async (value) => {
      // Check if the shift name already exists in the database
      const connection = await db.getConnection();
      const [existingShift] = await connection.query('SELECT * FROM shift WHERE name = ?', [value]);
      connection.release();

      // If the shift name already exists, return false to indicate validation failure
      if (existingShift.length > 0) {
          throw new Error('Shift name is already used');
      }

      // Otherwise, return true to indicate validation success
      return true;
  }),
  check('start_time')
    .notEmpty()
    .withMessage('Start time is required')
    .custom((value) => isValidTimeFormat(value, 'hh:mm'))
    .withMessage('Time must be in the format HH:mm'),
  check('end_time')
    .notEmpty()
    .withMessage('End time is required')
    .custom((value) => isValidTimeFormat(value, 'hh:mm'))
    .withMessage('Time must be in the format HH:mm'),
  check('working_days')
    .notEmpty()
    .withMessage('Working days are required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Working days must be between 3 and 255 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateDeduction = [
  
  check('deduction_type')
    .notEmpty()
    .withMessage('Deduction type is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Deduction type must be between 3 and 255 characters'),
  check('deduction_amount')
    .notEmpty()
    .withMessage('Deduction amount is required')
    .isFloat()
    .withMessage('Deduction amount must be a float number'),
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601('yyyy-mm-dd')
    .custom(isValidDateFormat).withMessage('date must be in the format yyyy:mm:dd'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateDepartment = [
  check('name')
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Department name must be between 3 and 255 characters')
    .custom(async (value) => {
      // Check if the shift name already exists in the database
      const connection = await db.getConnection();
      const [existingdepa] = await connection.query('SELECT * FROM department WHERE name = ?', [value]);
      connection.release();
      // If the shift name already exists, return false to indicate validation failure
      if (existingdepa.length > 0) {
          throw new Error('department name is already used');
      }
      // Otherwise, return true to indicate validation success
      return true;
  }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateBonus = [
  
  check('bonus_type')
    .notEmpty()
    .withMessage('Bonus type is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Bonus type must be between 3 and 255 characters'),
  check('bonus_amount')
    .notEmpty()
    .withMessage('Bonus amount is required')
    .isFloat()
    .withMessage('Bonus amount must be a float number'),
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601("yyyy-mm-dd ")
    .custom(isValidDateFormat).withMessage('date must be in the format yyyy-mm-dd'),

    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateAttendance = [
 
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601("yyyy-mm-dd")
    .custom(isValidDateFormat).withMessage(' date must be in the format yyyy-mm-dd'),
    check('time_in')
    .notEmpty()
    .withMessage('Time in is required')
    .custom((value) => isValidTimeFormat(value, 'hh:mm'))
    .withMessage('Time must be in the format HH:mm'),
  check('time_out')
    .notEmpty()
    .withMessage('Time out is required')
    .custom((value) => isValidTimeFormat(value, 'hh:mm'))
    .withMessage('Time must be in the format HH:mm'),
  check('total_hours_working')
    .notEmpty()
    .withMessage('Total hours working is required')
    .isInt()
    .withMessage('Total hours worked must be a int number'),
  check('overtime_hours')
    .notEmpty()
    .withMessage('Overtime hours is required')
    .isInt()
    .withMessage('Overtime hours must be a int number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateEmployee = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .custom(async (value) => {
      // Check if the shift name already exists in the database
      const connection = await db.getConnection();
      const [existingemplo] = await connection.query('SELECT * FROM employee WHERE name = ?', [value]);
      connection.release();
      // If the shift name already exists, return false to indicate validation failure
      if (existingemplo.length > 0) {
          throw new Error('employee name is already used');
      }
      // Otherwise, return true to indicate validation success
      return true;
  }),
  check('hire_date')
    .notEmpty()
    .withMessage('Hire date is required')
    .isISO8601('yyyy-mm-dd')
    .withMessage('Hire date must be a valid ISO 8601 date')
    .custom(isValidDateFormat).withMessage('Hire date must be in the format yyyy-mm-dd'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.validateCreateLeave = [
  check('type_of_leave')
    .notEmpty()
    .withMessage('Type of leave is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Type of leave must be at least 3 characters long and no more than 255 characters long'),
  check('start_date')
  .notEmpty()
  .withMessage('Date is required')
  .isISO8601('yyyy-mm-dd')
  .custom(isValidDateFormat).withMessage('date must be in the format yyyy:mm:dd'),
  check('end_date')
  .notEmpty()
  .withMessage('Date is required')
  .isISO8601('yyyy-mm-dd')
  .custom(isValidDateFormat).withMessage('date must be in the format yyyy:mm:dd'),
  check('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt()
    .withMessage('Duration must be an integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];
exports.validateCreateEmployeePositionHistory = [
  check('position')
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Position must be at least 3 characters long and no more than 255 characters long'),
  
  check('start_date')
  .notEmpty()
  .withMessage('Date is required')
  .isISO8601('yyyy-mm-dd')
  .custom(isValidDateFormat).withMessage('Hire date must be in the format yyyy-mm-dd'),
  check('end_date')
  .notEmpty()
  .withMessage('Date is required')
  .isISO8601('yyyy-mm-dd')
  .custom(isValidDateFormat).withMessage('Hire date must be in the format yyyy-mm-dd'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];


exports.validateCreatePromotion = [
 
  check('date')
    .notEmpty()
    .withMessage('Promotion date is required')
    .isISO8601('yyyy-mm-dd')
    .custom(isValidDateFormat).withMessage('promotion date must be in the format yyyy-mm-dd'),

  check('prev_position')
    .notEmpty()
    .withMessage('Previous position is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Previous position must be at least 3 characters long and no more than 255 characters long'),
  check('new_position')
    .notEmpty()
    .withMessage('New position is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('New position must be at least 3 characters long and no more than 255 characters long'),
  check('salary_increasing')
    .notEmpty()
    .withMessage('Salary increase is required')
    .isInt()
    .withMessage('Salary increase must be a int number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];


exports.validateCreateSalary = [
  
  check('gross_salary')
    .notEmpty()
    .withMessage('Gross salary is required')
    .isFloat()
    .withMessage('Gross salary must be a float number'),
  check('net_salary')
    .notEmpty()
    .withMessage('Net salary is required')
    .isFloat()
    .withMessage('Net salary must be a float number'),
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601('yyyy-mm-dd')
    .custom(isValidDateFormat).withMessage('Hire date must be in the format yyyy-mm-dd'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];
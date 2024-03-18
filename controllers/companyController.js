const db = require('../db');

const createCompany = async (req, res) => {
    const { name, manager, website, location, industry } = req.body;

    try {
        const connection = await db.getConnection();
        const [result] = await connection.query(`
            INSERT INTO companies (name, manager, website, location, industry)
            VALUES (?, ?, ?, ?, ?)
        `, [name, manager, website, location, industry]);
        connection.release();

        res.status(201).json({
            status: 'Create company successfully',
            data: {
                company: {
                    id: result.insertId,
                    name,
                    manager,
                    website,
                    location,
                    industry,
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [companies] = await connection.query(`
            SELECT c.*, e.*
            FROM companies c
            LEFT JOIN employee e ON c.id = e.company_id
        `);
        connection.release();

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCompanyById = async (req, res) => {
    const companyId = req.params.id;

    try {
        const connection = await db.getConnection();
        const [company] = await connection.query(`
            SELECT c.*, e.*
            FROM companies c
            LEFT JOIN employee e ON c.id = e.company_id
            WHERE c.id = ?
        `, [companyId]);
        connection.release();

        if (!company.length) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCompany = async (req, res) => {
  const { name, manager, website, location, industry } = req.body;
  const companyId = req.params.id;

  try {
      const connection = await db.getConnection();
      await connection.query(`
          UPDATE companies
          SET name = ?, manager = ?, website = ?, location = ?, industry = ?
          WHERE id = ?
      `, [name, manager, website, location, industry, companyId]);
      connection.release();

      res.status(200).json({
          status: 'success',
          message: 'Company updated successfully'
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

/*
const updateCompany = async (req, res) => {
  const { name, manager, website, location, industry } = req.body;
  const companyId = req.params.id;

  try {
      const connection = await db.getConnection();
      await connection.query(`
          UPDATE companies
          SET name = ?,  manager = ?, website = ?, location = ?, industry = ?
          WHERE id = ?
      `, [name, manager, website, location, industry, companyId]);
      connection.release();

      const [updatedCompany] = await connection.query(`
          SELECT c.*, e.*
          FROM companies c
          LEFT JOIN employee e ON c.id = e.FK_Company_ID
          WHERE c.id = ?
      `, [companyId]);

      res.status(200).json(updatedCompany[0]);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
*/

const deleteCompany = async (req, res) => {
    const companyId = req.params.id;

    try {
        const connection = await db.getConnection();
        await connection.query(`
            DELETE FROM companies
            WHERE id = ?
        `, [companyId]);
        connection.release();
        
        res.status(204).json({message:"deleted successfully"});
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a company by ID with its employees and related details
const getCompanywithemployeesById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const getCompanyQuery = `
      SELECT c.id AS Company_ID, c.Company_Name, c.industry, c.location, c.website,
             e.id AS Employee_ID, e.Employee_Name, e.Hire_Date, e.Gross_salary, e.Net_salary, e.Time_in, e.Time_out,
             d.Department_Name, s.Shift_Name,
             a.Username AS Account_Username,
             l.id AS Leave_ID, l.Type_of_leave, l.Start_date AS Leave_Start_date, l.End_date AS Leave_End_date, l.Duration,
             ded.id AS Deduction_ID, ded.Deduction_Type, ded.Deduction_Amount, ded.Date AS Deduction_Date,
             p.id AS Promotion_ID, p.Promotion_Date, p.Prev_Position, p.New_Position, p.Salary_Increase, p.Date AS Promotion_Date
      FROM companies c
      LEFT JOIN employees e ON c.id = e.FK_Company_ID
      LEFT JOIN departments d ON e.FK_Department_ID = d.id
      LEFT JOIN shifts s ON e.FK_Shift_ID = s.id
      LEFT JOIN accounts a ON e.FK_Account_ID = a.id
      LEFT JOIN leaves l ON e.id = l.FK_employeeid_leave
      LEFT JOIN deductions ded ON e.id = ded.FK_employeeid
      LEFT JOIN promotions p ON e.id = p.FK_Employee_ID
      WHERE c.id = ?
    `;
    
    const [company] = await db.query(getCompanyQuery, [companyId]);

    if (!company.length) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const companyInfo = {
      id: company[0].Company_ID,
      name: company[0].Company_Name,
      industry: company[0].industry,
      location: company[0].location,
      website: company[0].website,
      employees: []
    };

    company.forEach(row => {
      companyInfo.employees.push({
        id: row.Employee_ID,
        name: row.Employee_Name,
        hireDate: row.Hire_Date,
        grossSalary: row.Gross_salary,
        netSalary: row.Net_salary,
        timeIn: row.Time_in,
        timeOut: row.Time_out,
        department: row.Department_Name,
        shift: row.Shift_Name,
        accountUsername: row.Account_Username,
        leaves: {
          id: row.Leave_ID,
          type: row.Type_of_leave,
          startDate: row.Leave_Start_date,
          endDate: row.Leave_End_date,
          duration: row.Duration
        },
        deductions: {
          id: row.Deduction_ID,
          type: row.Deduction_Type,
          amount: row.Deduction_Amount,
          date: row.Deduction_Date
        },
        promotions: {
          id: row.Promotion_ID,
          date: row.Promotion_Date,
          prevPosition: row.Prev_Position,
          newPosition: row.New_Position,
          salaryIncrease: row.Salary_Increase
        }
      });
    });

    res.status(200).json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies with their employees and related details
const getAllCompaniesWithEmployees = async (req, res) => {
  try {
    const getAllCompaniesQuery = `
      SELECT c.id AS Company_ID, c.Company_Name, c.industry, c.location, c.website,
             e.id AS Employee_ID, e.Employee_Name, e.Hire_Date, e.Gross_salary, e.Net_salary, e.Time_in, e.Time_out,
             d.Department_Name, s.Shift_Name,
             a.Username AS Account_Username,
             l.id AS Leave_ID, l.Type_of_leave, l.Start_date AS Leave_Start_date, l.End_date AS Leave_End_date, l.Duration,
             ded.id AS Deduction_ID, ded.Deduction_Type, ded.Deduction_Amount, ded.Date AS Deduction_Date,
             p.id AS Promotion_ID, p.Promotion_Date, p.Prev_Position, p.New_Position, p.Salary_Increase, p.Date AS Promotion_Date
      FROM companies c
      LEFT JOIN employees e ON c.id = e.FK_Company_ID
      LEFT JOIN departments d ON e.FK_Department_ID = d.id
      LEFT JOIN shifts s ON e.FK_Shift_ID = s.id
      LEFT JOIN accounts a ON e.FK_Account_ID = a.id
      LEFT JOIN leaves l ON e.id = l.FK_employeeid_leave
      LEFT JOIN deductions ded ON e.id = ded.FK_employeeid
      LEFT JOIN promotions p ON e.id = p.FK_Employee_ID
    `;
    
    const companies = await db.query(getAllCompaniesQuery);

    const companiesWithEmployees = {};

    companies.forEach(row => {
      if (!companiesWithEmployees[row.Company_ID]) {
        companiesWithEmployees[row.Company_ID] = {
          id: row.Company_ID,
          name: row.Company_Name,
          industry: row.industry,
          location: row.location,
          website: row.website,
          employees: []
        };
      }

      companiesWithEmployees[row.Company_ID].employees.push({
        id: row.Employee_ID,
        name: row.Employee_Name,
        hireDate: row.Hire_Date,
        grossSalary: row.Gross_salary,
        netSalary: row.Net_salary,
        timeIn: row.Time_in,
        timeOut: row.Time_out,
        department: row.Department_Name,
        shift: row.Shift_Name,
        accountUsername: row.Account_Username,
        leaves: {
          id: row.Leave_ID,
          type: row.Type_of_leave,
          startDate: row.Leave_Start_date,
          endDate: row.Leave_End_date,
          duration: row.Duration
        },
        deductions: {
          id: row.Deduction_ID,
          type: row.Deduction_Type,
          amount: row.Deduction_Amount,
          date: row.Deduction_Date
        },
        promotions: {
          id: row.Promotion_ID,
          date: row.Promotion_Date,
          prevPosition: row.Prev_Position,
          newPosition: row.New_Position,
          salaryIncrease: row.Salary_Increase
        }
      });
    });

    const companiesArray = Object.values(companiesWithEmployees);
    res.status(200).json(companiesArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanyById,
  getAllCompaniesWithEmployees
};

module.exports = {
  getCompanywithemployeesById,
  getAllCompaniesWithEmployees,
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};

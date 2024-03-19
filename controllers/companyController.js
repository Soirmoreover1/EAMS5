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
      const [companies] = await connection.query('SELECT * FROM companies');
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
      const [company] = await connection.query('SELECT * FROM companies WHERE id = ?', [companyId]);
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

// Middleware to get the company of a specific employee
const getEmployeeCompany = async (employeeId) => {
  try {
      const connection = await db.getConnection();
      const [employee] = await connection.query(`
          SELECT 
              c.name AS company_name, 
              c.manager AS company_manager, 
              c.location AS company_location, 
              c.industry AS company_industry, 
              c.website AS company_website 
          FROM 
              employee e 
          INNER JOIN 
              companies c 
          ON 
              e.company_id = c.id 
          WHERE 
              e.id = ?`, 
          [employeeId]
      );
      connection.release();
      return employee;
  } catch (error) {
      console.error('Error fetching employee company:', error);
      throw error;
  }
};

module.exports = {
 // getCompanywithemployeesById,
 // getAllCompaniesWithEmployees,
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getEmployeeCompany,
};



 
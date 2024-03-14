const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const validateAuth = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Invalid role.' });
    }
    next();
  };
};

module.exports = {
  validateAuth,
  checkRoles
};
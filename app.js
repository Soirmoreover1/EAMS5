
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const {validateAuth , checkRoles } = require('./middlewares/authMiddleware');
// Routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const deductionRoutes = require('./routes/deductionRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const bonusRoutes = require('./routes/bonusRoutes');
const employeepositionhistoryRoutes = require('./routes/employeePositionHistoryRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('Public'));
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());

app.use('/auth', authRoutes);
app.use('/companies',validateAuth, companyRoutes);
app.use('/departments', validateAuth,departmentRoutes);
app.use('/employees', validateAuth,employeeRoutes);
app.use('/leaves', validateAuth,leaveRoutes);
app.use('/deductions',validateAuth, deductionRoutes);
app.use('/promotions',validateAuth, promotionRoutes);
app.use('/shifts',validateAuth, shiftRoutes);
app.use('/salaries',validateAuth, salaryRoutes);
app.use('/attendances',validateAuth, attendanceRoutes);
app.use('/bonuses',validateAuth, bonusRoutes);
app.use('/employeepositionhistory',validateAuth, employeepositionhistoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

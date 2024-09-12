const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const branchRoutes = require('./routes/branchRoutes');
const branchAdminRoutes = require('./routes/branchAdmin');
const branchTypeRoutes = require('./routes/branchTypeRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const classRoutes = require('./routes/classRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const staffRoutes = require('./routes/staffRoutes');
const guardianRoutes = require('./routes/guardianRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoute = require('./routes/studentRoutes');
const path = require('path');

const app = express();
connectDB();

app.get('/ping', (req, res) => {
    res.send('pinged');
});

// Middlewares

const corsOptions = {
  origin: '*', // Adjust this to your specific domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


// Serve static files from React app (assuming the build folder is in harisLmsClient-temp-main/dist)
const buildPath = path.join(__dirname, '../harisLmsClient-temp-main/dist');
app.use(express.static(buildPath));



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/assets/images/branchAdmin', express.static(path.join(__dirname, 'assets', 'images', 'branchAdmin')));
app.use('/assets/images/staff', express.static(path.join(__dirname, 'assets', 'images', 'staff')));
app.use('/assets/images/teacher', express.static(path.join(__dirname, 'assets', 'images', 'teacher')));
app.use('/assets/images/student', express.static(path.join(__dirname, 'assets', 'images', 'student')));


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/branch-admin', branchAdminRoutes);
app.use('/api/branch-type', branchTypeRoutes);
app.use('/api/user-role', userRoleRoutes);
app.use('/api/class', classRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/guardian', guardianRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoute);


// Health Check Route
app.get('/ping', (req, res) => {
  res.send('pinged');
});

// Catch-all handler to serve React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
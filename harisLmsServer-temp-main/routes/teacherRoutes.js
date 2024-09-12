const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

// Register Teacher
router.post('/create', authMiddleware, teacherController.registerTeacher);

// Get All Teachers
router.get('/get-all', authMiddleware, teacherController.getAllTeachers);

// Get Teacher by ID
router.get('/get-by-id/:id', authMiddleware, teacherController.getTeacherById);

// Update Teacher
router.put('/update/:id', authMiddleware, teacherController.updateTeacher);

// Delete Teacher
router.delete('/delete/:id', authMiddleware, teacherController.deleteTeacher);

module.exports = router;

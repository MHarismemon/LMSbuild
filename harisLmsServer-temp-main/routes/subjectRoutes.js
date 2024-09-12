const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Subject
router.post('/create', authMiddleware, subjectController.createSubject);

// Get All Subjects
router.get('/get-all', authMiddleware, subjectController.getAllSubjects);

// Get Subject by ID
router.get('/get-by-id/:id', authMiddleware, subjectController.getSubjectById);

// Update Subject
router.put('/update/:id', authMiddleware, subjectController.updateSubject);

// Delete Subject
router.delete('/delete/:id', authMiddleware, subjectController.deleteSubject);

module.exports = router;

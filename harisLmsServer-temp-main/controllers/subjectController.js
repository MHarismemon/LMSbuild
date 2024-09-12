const Subject = require('../models/Subject');
const Section = require('../models/Section');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

// Create a new subject
exports.createSubject = async (req, res) => {
    const { sectionId, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionId, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of section
        const section = await Section.findById(sectionId);
        if (!section) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        // Create a new Subject entry
        const subject = new Subject({ sectionId, subjectName });
        const savedSubject = await subject.save();

        sendSuccessResponse(res, 201, 'Subject created successfully', savedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    const { branchId } = req.query;
    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        // Find all sections that match the branchId
        const sections = await Section.find({ branchId });
        if (sections.length === 0) {
            return sendErrorResponse(res, 404, 'No sections found for this branch');
        }

        const sectionIds = sections.map(section => section._id);

        // Find all subjects that are in the above sections
        const subjects = await Subject.find({ sectionId: { $in: sectionIds } }).populate('sectionId');

        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', subjects);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
// Get a subject by ID
exports.getSubjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await Subject.findById(id).populate('sectionId');
        if (!subject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject retrieved successfully', subject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a subject by ID
exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { sectionId, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ sectionId, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of section
        const section = await Section.findById(sectionId);
        if (!section) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        // Update the Subject entry
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { sectionId, subjectName },
            { new: true, runValidators: true }
        ).populate('sectionId');

        if (!updatedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }

        sendSuccessResponse(res, 200, 'Subject updated successfully', updatedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject deleted successfully', deletedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
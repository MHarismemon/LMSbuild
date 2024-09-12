const bcrypt = require('bcrypt');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const uploadTeacher = require('../middleware/uploadTeacher');

// Create a new Teacher
exports.registerTeacher = (req, res) => {
    uploadTeacher.single("photo")(req, res, async (err) => {
        if (err) {
            return sendErrorResponse(res, 400, "Image upload failed", err);
        }

        const {
            username,
            password,
            email,
            userRole,
            fullName,
            cnicNumber,
            phoneNumber,
            address,
            gender,
            cast,
            basicSalary,
            branchId,
            joinDate,
            teacherId,
        } = req.body;

        const photo = req.file ? req.file.filename : null;

        const missingFields = validateRequiredFields({
            username,
            password,
            email,
            userRole,
            fullName,
            cnicNumber,
            phoneNumber,
            address,
            gender,
            cast,
            basicSalary,
            branchId,
            joinDate,
            teacherId,
        });

        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        if (isNaN(Date.parse(joinDate))) {
            return sendErrorResponse(res, 400, 'Invalid join date format');
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return sendErrorResponse(res, 400, 'Email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                password: hashedPassword,
                email,
                userRole
            });

            const savedUser = await user.save();

            const teacher = new Teacher({
                fullName,
                cnicNumber,
                phoneNumber,
                address,
                gender,
                cast,
                basicSalary,
                userId: savedUser._id,
                branchId,
                joinDate: new Date(joinDate),
                teacherId,
                photo
            });

            const savedTeacher = await teacher.save();

            sendSuccessResponse(res, 201, 'Teacher registered successfully', { user: savedUser, teacher: savedTeacher });
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errorMessages = Object.values(err.errors).map(e => ({
                    path: e.path,
                    message: e.message
                }));

                sendErrorResponse(res, 400, 'Validation error', {
                    errors: errorMessages,
                    _message: err.message,
                    name: err.name
                });
            } else {
                console.error(err.message);
                sendErrorResponse(res, 500, 'Server error', err);
            }
        }
    });
};

// Update Teacher by ID
exports.updateTeacher = (req, res) => {
    uploadTeacher.single("photo")(req, res, async (err) => {
        if (err) {
            return sendErrorResponse(res, 400, "Image upload failed", err);
        }

        const { id } = req.params;
        const {
            fullName,
            cnicNumber,
            phoneNumber,
            address,
            gender,
            cast,
            basicSalary,
            branchId,
            joinDate,
            teacherId,
        } = req.body;

        const photo = req.file ? req.file.filename : null;

        try {
            const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
                fullName,
                cnicNumber,
                phoneNumber,
                address,
                gender,
                cast,
                basicSalary,
                branchId,
                joinDate: joinDate ? new Date(joinDate) : undefined,
                teacherId,
                ...(photo && { photo }) 
            }, { new: true });

            if (!updatedTeacher) {
                return sendErrorResponse(res, 404, 'Teacher not found');
            }

            sendSuccessResponse(res, 200, 'Teacher updated successfully', updatedTeacher);
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errorMessages = Object.values(err.errors).map(e => ({
                    path: e.path,
                    message: e.message
                }));

                sendErrorResponse(res, 400, 'Validation error', {
                    errors: errorMessages,
                    _message: err.message,
                    name: err.name
                });
            } else {
                console.error(err.message);
                sendErrorResponse(res, 500, 'Server error', err);
            }
        }
    });
};

// Get all Teachers for a specific branch
exports.getAllTeachers = async (req, res) => {
    const { branchId } = req.query;

    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        const teachers = await Teacher.find({ branchId }).populate('userId branchId');
        sendSuccessResponse(res, 200, 'Teachers retrieved successfully', teachers);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get Teacher by ID
exports.getTeacherById = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findById(id).populate('userId branchId');
        if (!teacher) {
            return sendErrorResponse(res, 404, 'Teacher not found');
        }
        sendSuccessResponse(res, 200, 'Teacher retrieved successfully', teacher);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};


// Delete Teacher by ID
exports.deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return sendErrorResponse(res, 404, 'Teacher not found');
        }

        // Optionally, you might want to delete the associated user as well
        await User.findByIdAndDelete(deletedTeacher.userId);

        sendSuccessResponse(res, 200, 'Teacher and associated user deleted successfully', deletedTeacher);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

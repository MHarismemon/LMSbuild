const Student = require('../models/Student');
const StudentOldAcademicInfo = require('../models/StudentOldAcademicInfo');
const User = require('../models/User');
const mongoose = require('mongoose');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const uploadStudent = require('../middleware/uploadStudent');

// Create Student
exports.registerStudent = async (req, res) => {
    uploadStudent.single("photo")(req, res, async (err) => {
        if (err) {
            console.error("Image upload error:", err);
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }

        // Parse and validate the data received
        const {
            username,
            password,
            email,
            fullName,
            admissionClass,
            castSurname,
            religion,
            nationality,
            dateOfBirth,
            placeOfBirth,
            gender,
            permanentAddress,
            emergencyContactPerson,
            emergencyPhoneNumber,
            guardianId,
            studentOldAcademicInfo = "[]", // Default to empty array if not present
            photocopiesCnic,
            birthCertificate,
            leavingCertificate,
            schoolReport,
            passportPhotos,
            monthlyFees,
            admissionFees,
            branchId,
            classId,
            sectionId,
            batchYear,
        } = req.body;

        // Attempt to parse studentOldAcademicInfo
        let academicInfoArray = [];
        try {
            academicInfoArray = JSON.parse(studentOldAcademicInfo);
        } catch (parseError) {
            console.error("Error parsing studentOldAcademicInfo:", parseError);
            return res.status(400).json({ message: "Invalid format for studentOldAcademicInfo" });
        }

        // Additional validation checks
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username, password, and email are required fields." });
        }

        try {
            // Handle file upload if present
            let photo = null;
            if (req.file) {
                photo = req.file.filename;
            }

            // 1. Create User
            const user = new User({
                username,
                password,
                email,
                userRole: 'student'
            });

            const savedUser = await user.save();

            // Fetch students count for roll number generation
            const studentsInBatch = await Student.countDocuments({ batchYear });
            const rollNumber = `${batchYear}/${studentsInBatch + 1}`;

            // 2. Create Student
            const student = new Student({
                fullName,
                admissionClass,
                castSurname,
                religion,
                nationality,
                dateOfBirth,
                placeOfBirth,
                gender,
                permanentAddress,
                emergencyContactPerson,
                emergencyPhoneNumber,
                guardianId,
                userId: savedUser._id,
                photocopiesCnic,
                birthCertificate,
                leavingCertificate,
                schoolReport,
                passportPhotos,
                monthlyFees,
                admissionFees,
                branchId,
                classId,
                sectionId,
                batchYear,
                rollNumber,
                photo, // Save photo if uploaded
            });

            const savedStudent = await student.save();

            // 3. Add Old Academic Information
            const academicInfoPromises = academicInfoArray.map(async (info) => {
                const academicInfo = new StudentOldAcademicInfo({
                    studentId: savedStudent._id,
                    instituteName: info.instituteName,
                    location: info.location,
                    from: info.from,
                    to: info.to,
                    upToClass: info.upToClass
                });

                const savedAcademicInfo = await academicInfo.save();
                return savedAcademicInfo._id;
            });

            const academicInfoIds = await Promise.all(academicInfoPromises);

            // Update the student with the old academic info IDs
            savedStudent.studentOldAcademicInfoId = academicInfoIds;
            await savedStudent.save();

            res.status(201).json({
                message: 'Student created successfully',
                student: savedStudent,
                user: savedUser
            });
        } catch (err) {
            console.error("Server error:", err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
};

// Update Student
exports.updateStudent = async (req, res) => {
    uploadStudent.single("photo")(req, res, async (err) => {
        if (err) {
            console.error("Image upload error:", err);
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }

        const { id } = req.params;
        const {
            fullName,
            admissionClass,
            castSurname,
            religion,
            nationality,
            dateOfBirth,
            placeOfBirth,
            gender,
            permanentAddress,
            emergencyContactPerson,
            emergencyPhoneNumber,
            guardianId,
            studentOldAcademicInfo = "[]", // Default to empty array if not present
            photocopiesCnic,
            birthCertificate,
            leavingCertificate,
            schoolReport,
            passportPhotos,
            monthlyFees,
            admissionFees,
            branchId,
            classId,
            sectionId,
            batchYear,
        } = req.body;

        // Parse studentOldAcademicInfo if it is a string
        let academicInfoArray = [];
        try {
            academicInfoArray = JSON.parse(studentOldAcademicInfo);
        } catch (parseError) {
            console.error("Error parsing studentOldAcademicInfo:", parseError);
            return res.status(400).json({ message: "Invalid format for studentOldAcademicInfo" });
        }

        try {
            // Find the student by ID
            const student = await Student.findById(id);

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            // Handle file upload if present
            if (req.file) {
                student.photo = req.file.filename; // Update the photo if a new file is uploaded
            }

            // Update Student fields
            student.fullName = fullName;
            student.admissionClass = admissionClass;
            student.castSurname = castSurname;
            student.religion = religion;
            student.nationality = nationality;
            student.dateOfBirth = dateOfBirth;
            student.placeOfBirth = placeOfBirth;
            student.gender = gender;
            student.permanentAddress = permanentAddress;
            student.emergencyContactPerson = emergencyContactPerson;
            student.emergencyPhoneNumber = emergencyPhoneNumber;
            student.guardianId = guardianId;
            student.photocopiesCnic = photocopiesCnic;
            student.birthCertificate = birthCertificate;
            student.leavingCertificate = leavingCertificate;
            student.schoolReport = schoolReport;
            student.passportPhotos = passportPhotos;
            student.monthlyFees = monthlyFees;
            student.admissionFees = admissionFees;
            student.branchId = branchId;
            student.classId = classId;
            student.sectionId = sectionId;
            student.batchYear = batchYear;

            const updatedStudent = await student.save();

            // Update Old Academic Info if provided and is an array
            if (academicInfoArray.length > 0) {
                // Remove existing academic info linked to the student
                await StudentOldAcademicInfo.deleteMany({ studentId: id });

                // Save new academic info entries
                const academicInfoPromises = academicInfoArray.map(async (info) => {
                    const academicInfo = new StudentOldAcademicInfo({
                        studentId: updatedStudent._id,
                        instituteName: info.instituteName,
                        location: info.location,
                        from: info.from,
                        to: info.to,
                        upToClass: info.upToClass
                    });

                    return await academicInfo.save();
                });

                const savedAcademicInfos = await Promise.all(academicInfoPromises);
                // Update student document with the IDs of the saved academic infos
                updatedStudent.studentOldAcademicInfoId = savedAcademicInfos.map(info => info._id);
                await updatedStudent.save();
            }

            res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
        } catch (err) {
            console.error("Error updating student:", err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
};


// Get All Students
exports.getAllStudent = async (req, res) => {
    const { branchId } = req.query;

    if (!branchId) {
        return res.status(400).json({ message: 'Branch ID is required' });
    }

    try {
        const students = await Student.find({ branchId })
            .populate('userId')
            .populate('guardianId')
            .populate('studentOldAcademicInfoId')
            .populate('branchId')
            .populate('classId')
            .populate('sectionId');
            
        res.status(200).json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get Student by ID
exports.getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id)
            .populate('userId')
            .populate('guardianId')
            .populate('studentOldAcademicInfoId')
            .populate('branchId')
            .populate('classId')
            .populate('sectionId');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the student by ID
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete the associated user
        await User.findByIdAndDelete(student.userId);

        // Delete associated old academic info
        await StudentOldAcademicInfo.deleteMany({ studentId: id });

        // Delete the student
        await Student.findByIdAndDelete(id);

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Fetch students by batch year
exports.getStudentsByBatchYear = async (req, res) => {
    const { batchYear } = req.query;

    if (!batchYear) {
        return res.status(400).json({ message: 'Batch Year is required' });
    }

    try {
        const students = await Student.find({ batchYear: batchYear });

        res.status(200).json(students);
    } catch (err) {
        console.error('Error fetching students by batch year:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const Student = require('../models/Student');
const Proctor = require('../models/Proctor');
const Admin = require('../models/Admin');
const xlsx = require('xlsx');
const fs = require('fs');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all proctors
exports.getAllProctors = async (req, res) => {
    try {
        const proctors = await Proctor.find().select('-password').sort({ createdAt: -1 });
        res.json(proctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Don't allow password updates through this endpoint
        delete updates.password;

        const currentStudent = await Student.findById(id);
        if (!currentStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Handle Proctor Assignment Change
        if (updates.proctorId !== undefined) {
            const oldProctorId = currentStudent.proctorId;
            const newProctorId = updates.proctorId;

            // If proctor is changing
            if (oldProctorId && (!newProctorId || oldProctorId.toString() !== newProctorId)) {
                // Remove from old proctor
                await Proctor.findByIdAndUpdate(oldProctorId, {
                    $pull: { assignedStudents: id }
                });
            }

            // If new proctor is assigned
            if (newProctorId) {
                // Add to new proctor
                await Proctor.findByIdAndUpdate(newProctorId, {
                    $addToSet: { assignedStudents: id }
                });
            }
        }

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update proctor
exports.updateProctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Don't allow password updates through this endpoint
        delete updates.password;

        const proctor = await Proctor.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        res.json(proctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Don't allow password updates through this endpoint
        delete updates.password;

        const admin = await Admin.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Also delete related hackathons
        const Hackathon = require('../models/Hackathon');
        await Hackathon.deleteMany({ studentId: id });

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student and related hackathons deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete proctor
exports.deleteProctor = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if proctor has assigned hackathons
        const Hackathon = require('../models/Hackathon');
        const assignedHackathons = await Hackathon.find({ proctorId: id });

        if (assignedHackathons.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete proctor with assigned hackathons. Please reassign hackathons first.'
            });
        }

        const proctor = await Proctor.findByIdAndDelete(id);

        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        res.json({ message: 'Proctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete admin (prevent self-deletion)
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own admin account' });
        }

        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const proctorCount = await Proctor.countDocuments();
        const adminCount = await Admin.countDocuments();

        res.json({
            students: studentCount,
            proctors: proctorCount,
            admins: adminCount,
            total: studentCount + proctorCount + adminCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new proctor
exports.createProctor = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingProctor = await Proctor.findOne({ email });
        if (existingProctor) {
            return res.status(400).json({ message: 'Proctor already exists with this email' });
        }

        const proctor = await Proctor.create({
            name,
            email,
            password,
            department
        });

        res.status(201).json({ message: 'Proctor created successfully', proctor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk Upload Students
exports.bulkUploadStudents = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const row of data) {
            try {
                // Expected columns: Name, Email, RegisterNo, Department, Year, Password
                const { Name, Email, RegisterNo, Department, Year, Password } = row;

                if (!Name || !Email || !RegisterNo || !Department || !Year || !Password) {
                    throw new Error('Missing required fields');
                    /* 
                     * Note: Ensure Excel columns match these names EXACTLY (case-sensitive) 
                     * or adjust manually. Recommended template provided in UI.
                     */
                }

                // Check for existing student
                const existingStudent = await Student.findOne({
                    $or: [{ email: Email }, { registerNo: RegisterNo }]
                });

                if (existingStudent) {
                    throw new Error(`Student with Email ${Email} or RegisterNo ${RegisterNo} already exists`);
                }

                // Check and assign proctor
                let proctorId = null;
                const proctor = await Proctor.findOne({ department: Department });
                if (proctor) {
                    proctorId = proctor._id;
                }

                const newStudent = await Student.create({
                    name: Name,
                    email: Email,
                    registerNo: RegisterNo,
                    department: Department,
                    year: Year,
                    password: Password, // Will be hashed by pre-save hook
                    proctorId: proctorId
                });

                if (proctor) {
                    proctor.assignedStudents.push(newStudent._id);
                    await proctor.save();
                }

                successCount++;
            } catch (err) {
                failCount++;
                errors.push({ row: row, error: err.message });
            }
        }

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Bulk upload processing completed',
            summary: {
                total: data.length,
                success: successCount,
                failed: failCount,
                errors: errors
            }
        });

    } catch (error) {
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
};

// Bulk Upload Proctors
exports.bulkUploadProctors = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const row of data) {
            try {
                // Expected columns: Name, Email, Department, Password
                const { Name, Email, Department, Password } = row;

                if (!Name || !Email || !Department || !Password) {
                    throw new Error('Missing required fields');
                }

                const existingProctor = await Proctor.findOne({ email: Email });
                if (existingProctor) {
                    throw new Error(`Proctor with Email ${Email} already exists`);
                }

                await Proctor.create({
                    name: Name,
                    email: Email,
                    department: Department,
                    password: Password
                });

                successCount++;
            } catch (err) {
                failCount++;
                errors.push({ row: row, error: err.message });
            }
        }

        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Bulk upload processing completed',
            summary: {
                total: data.length,
                success: successCount,
                failed: failCount,
                errors: errors
            }
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
};

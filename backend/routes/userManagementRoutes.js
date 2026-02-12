const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllStudents,
    getAllProctors,
    getAllAdmins,
    updateStudent,
    updateProctor,
    updateAdmin,
    deleteStudent,
    deleteProctor,
    deleteAdmin,
    getUserStats,
    createProctor,
    bulkUploadStudents,
    bulkUploadProctors
} = require('../controllers/userManagementController');

// Admin-only middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Get all users
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/proctors', protect, authorize('admin'), getAllProctors);
router.get('/admins', protect, authorize('admin'), getAllAdmins);
router.get('/stats', protect, authorize('admin'), getUserStats);

// Create proctor
router.post('/proctors', protect, authorize('admin'), createProctor);

// Update users
router.put('/students/:id', protect, authorize('admin'), updateStudent);
router.put('/proctors/:id', protect, authorize('admin'), updateProctor);
router.put('/admins/:id', protect, authorize('admin'), updateAdmin);

// Delete users
router.delete('/students/:id', protect, authorize('admin'), deleteStudent);
router.delete('/proctors/:id', protect, authorize('admin'), deleteProctor);
router.delete('/admins/:id', protect, authorize('admin'), deleteAdmin);

// Bulk Upload
const upload = require('../middleware/uploadMiddleware');

router.post('/students/bulk-upload', protect, authorize('admin'), upload.single('file'), bulkUploadStudents);
router.post('/proctors/bulk-upload', protect, authorize('admin'), upload.single('file'), bulkUploadProctors);

module.exports = router;

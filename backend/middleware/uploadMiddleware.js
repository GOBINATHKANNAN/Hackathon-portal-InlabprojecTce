const multer = require('multer');
const path = require('path');

const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // If user is a student (req.user is now fully populated from authMiddleware)
        if (req.query.teamName && req.user && req.user.role === 'student') {
            const teamName = req.query.teamName.replace(/[^a-zA-Z0-9]/g, '_');
            const studentName = req.user.name ? req.user.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Unknown';
            uploadPath = `uploads/teams/${teamName}/${studentName}/`;
        } else if (req.user && req.user.role === 'student') {
            const safeName = req.user.name ? req.user.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') : 'Unknown';
            const regNo = req.user.registerNo || 'NoReg';
            uploadPath = `uploads/students/${safeName}_${regNo}/`;
        } else if (file.fieldname === 'poster') {
            uploadPath = 'uploads/admin/';
        } else {
            uploadPath = 'uploads/others/';
        }

        // Create directory if it doesn't exist
        console.log('Final Calculated Upload Path:', uploadPath);
        if (!fs.existsSync(uploadPath)) {
            console.log('Path does not exist, creating:', uploadPath);
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Sanitize filename to remove spaces
        const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${sanitizedOriginalName}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, and PPTs are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

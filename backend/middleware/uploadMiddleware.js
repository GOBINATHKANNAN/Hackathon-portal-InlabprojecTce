const multer = require('multer');
const path = require('path');

const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // If user is a student and has a register number (from auth middleware)
        if (req.user && req.user.role === 'student' && req.user.registerNo) {
            uploadPath = `uploads/students/${req.user.registerNo}/`;
        } else if (file.fieldname === 'poster') {
            uploadPath = 'uploads/admin/';
        } else {
            uploadPath = 'uploads/others/';
        }

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
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

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary if credentials are provided
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            let folder = 'hackathon-portal';

            // Dynamic folder selection based on logic previously used for local disk
            if (req.query.teamName && req.user && req.user.role === 'student') {
                const teamName = req.query.teamName.replace(/[^a-zA-Z0-9]/g, '_');
                folder = `hackathon-portal/teams/${teamName}`;
            } else if (req.user && req.user.role === 'student') {
                const safeName = req.user.name ? req.user.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') : 'Unknown';
                const regNo = req.user.registerNo || 'NoReg';
                folder = `hackathon-portal/students/${safeName}_${regNo}`;
            } else if (file.fieldname === 'poster') {
                folder = 'hackathon-portal/admin';
            }

            return {
                folder: folder,
                resource_type: 'auto', // Important for PDFs
                allowed_formats: ['jpg', 'png', 'pdf', 'ppt', 'pptx', 'xlsx', 'xls'],
                public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
            };
        }
    });
    console.log('✅ Cloudinary Storage Initialized');
} else {
    // Fallback to Local Storage
    console.log('⚠️ Cloudinary credentials missing. Falling back to Local Disk Storage.');
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let uploadPath = 'uploads/';

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

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
            cb(null, `${Date.now()}-${sanitizedOriginalName}`);
        }
    });
}

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, PPTs, and Excel files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

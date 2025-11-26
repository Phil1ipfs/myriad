const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'janna/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for event images
const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'janna/events',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for valid IDs
const validIdStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'janna/valid-ids',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const uploadProfile = multer({ storage: profileStorage });
const uploadEvent = multer({ storage: eventStorage });
const uploadValidId = multer({ storage: validIdStorage });

module.exports = {
  cloudinary,
  uploadProfile,
  uploadEvent,
  uploadValidId,
};
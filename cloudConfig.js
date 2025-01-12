const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: async (req, file) => {return ['jpeg', 'png', 'jpg']},
        public_id: (req, file) => {
            // Generate a unique name using Date and original filename
            const listingImage = "listingImage";
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `${listingImage}-${uniqueSuffix}-${file.originalname}`.replace(/\s+/g, '-'); // Replace spaces with dashes
        },
    },
});

module.exports = { cloudinary, storage };
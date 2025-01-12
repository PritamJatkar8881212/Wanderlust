const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const extractPublicId = (imageUrl) => {
    const parts = imageUrl.split('/');
    const versionIndex = parts.findIndex(part => part.startsWith('v')) + 1;
    const publicIdWithExtension = parts.slice(versionIndex).join('/');
    return publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove file extension
};

const deleteImageByUrl = (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    console.log(publicId);

    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('Error deleting image:', error);
        } else {
            console.log('Image deleted successfully:', result);
        }
    });
};

const imageUrl = 'hhttps://res.cloudinary.com/dyo2xpdcb/image/upload/v1736082474/wanderlust_DEV/listingImage-1736082472632-36998702-KakashiHatake-SteamProfile.jpg.jpg';

deleteImageByUrl(imageUrl);

import { v2 as cloudinary } from 'cloudinary';
import {config} from '../config';
import logger from './logger';

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_APIKEY,
    api_secret: config.CLOUDINARY_APISECRET,
});

export const uploadImage = async (file: string, folder: string = 'findyourhotel'): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        logger.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
};

export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logger.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
};

export const getImageUrl = (publicId: string, options: any = {}): string => {
    return cloudinary.url(publicId, options);
};

export default cloudinary; 
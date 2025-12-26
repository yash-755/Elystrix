import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export interface UploadResult {
    url: string;
    publicId: string;
    format?: string;
}

/**
 * Uploads a file buffer to Cloudinary.
 * @param buffer - The file buffer.
 * @param folder - 'elystrix/users', 'elystrix/courses', etc.
 * @param resourceType - 'image' or 'raw' (for PDF). 'auto' also works but explicit is safer.
 */
export async function uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(error);
                    return;
                }
                if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        format: result.format,
                    });
                } else {
                    reject(new Error("Upload success but no result returned."));
                }
            }
        );

        uploadStream.end(buffer);
    });
}

export default cloudinary;

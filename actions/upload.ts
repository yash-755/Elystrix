"use server"

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "elystrix";

        if (!file) {
            throw new Error("No file provided");
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.");
        }

        // Size limit check (5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error("File size exceeds 5MB limit.");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await uploadToCloudinary(buffer, folder);

        return { success: true, url: result.secure_url };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { success: false, error: error.message };
    }
}

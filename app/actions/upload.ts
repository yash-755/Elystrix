"use server"

import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract file from FormData
const getFileFromFormData = (formData: FormData, key: string = "file"): File | null => {
    const file = formData.get(key) as File;
    if (!file || file.size === 0) return null;
    return file;
};

// Helper to convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

/**
 * Upload User Profile Image
 */
export async function uploadUserProfileImage(formData: FormData, firebaseUid: string) {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        // Server-side Validation
        if (file.size > 5 * 1024 * 1024) throw new Error("File too large (Max 5MB)");
        if (!file.type.startsWith("image/")) throw new Error("Invalid file type");

        const buffer = await fileToBuffer(file);

        // 1. Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, `elystrix/users/${firebaseUid}`, "image");

        // 2. Update MongoDB via Prisma
        // We need to find the user by firebaseUid because that's what we have.
        // Prisma schema: User { firebaseUid String @unique ... }
        await prisma.user.update({
            where: { firebaseUid: firebaseUid },
            data: { profileImageUrl: result.url },
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true, url: result.url };
    } catch (error: any) {
        console.error("Profile upload error:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}

/**
 * Upload Course Thumbnail
 */
export async function uploadCourseThumbnail(formData: FormData, courseId: string) {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        const buffer = await fileToBuffer(file);
        const result = await uploadToCloudinary(buffer, "elystrix/courses", "image");

        await prisma.course.update({
            where: { id: courseId },
            data: { thumbnailUrl: result.url },
        });

        revalidatePath(`/dashboard/courses/${courseId}`);
        revalidatePath("/dashboard/courses");
        revalidatePath("/courses");
        revalidatePath("/admin/courses");
        return { success: true, url: result.url };
    } catch (error) {
        console.error("Course thumbnail upload error:", error);
        return { success: false, error: "Upload failed" };
    }
}

/**
 * Upload Chapter Media
 */
export async function uploadChapterMedia(formData: FormData, chapterId: string) {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        // Determine type (image or video/raw?) - User said "mediaUrl".
        // Cloudinary 'auto' is good, but let's default to auto to support video/pdf/img
        const buffer = await fileToBuffer(file);
        const result = await uploadToCloudinary(buffer, "elystrix/chapters", "auto");

        await prisma.chapter.update({
            where: { id: chapterId },
            data: { mediaUrl: result.url },
        });

        return { success: true, url: result.url };
    } catch (error) {
        console.error("Chapter media upload error:", error);
        return { success: false, error: "Upload failed" };
    }
}

/**
 * Upload Certificate Image
 */
export async function uploadCertificateImage(formData: FormData, certificateId: string) {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        const buffer = await fileToBuffer(file);
        const result = await uploadToCloudinary(buffer, "elystrix/certificates/images", "image");

        await prisma.certificate.update({
            where: { id: certificateId },
            data: { imageUrl: result.url },
        });

        return { success: true, url: result.url };
    } catch (error) {
        console.error("Certificate image upload error:", error);
        return { success: false, error: "Upload failed" };
    }
}

/**
 * Upload Certificate PDF
 */
export async function uploadCertificatePdf(formData: FormData, certificateId: string) {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        const buffer = await fileToBuffer(file);
        // resource_type 'raw' or 'auto' for PDF. 'auto' usually detects PDF as 'image' (pages) or 'raw'.
        // Cloudinary treats PDFs as 'image' often to generate thumbnails, but 'raw' delivers original.
        // User asked for "PDFs". Let's use 'auto' or 'raw'. Safe is 'auto' + explicit handling if needed.
        // For "pdfUrl", we want the file.
        const result = await uploadToCloudinary(buffer, "elystrix/certificates/pdfs", "auto");

        await prisma.certificate.update({
            where: { id: certificateId },
            data: { pdfUrl: result.url },
        });

        return { success: true, url: result.url };
    } catch (error) {
        console.error("Certificate PDF upload error:", error);
        return { success: false, error: "Upload failed" };
    }
}

/**
 * Generic Upload Media (No DB Update)
 */
export async function uploadMedia(formData: FormData, folder: string = "elystrix/misc") {
    try {
        const file = getFileFromFormData(formData);
        if (!file) throw new Error("No file provided");

        if (file.size > 10 * 1024 * 1024) throw new Error("File too large (Max 10MB)");

        const buffer = await fileToBuffer(file);
        const result = await uploadToCloudinary(buffer, folder, "auto");

        return { success: true, url: result.url };
    } catch (error: any) {
        console.error("Media upload error:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}



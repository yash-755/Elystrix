import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        // 2. Perform Test Upload
        const base64Pixel = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        const buffer = Buffer.from(base64Pixel, "base64");

        const result = await uploadToCloudinary(buffer, "elystrix/test", "image");

        return NextResponse.json({
            status: "SUCCESS",
            cloudName: cloudName,
            url: result.url,
            publicId: result.publicId
        });

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json(
            { status: "FAILED", error: error.message || "Unknown error", details: error },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";

export async function GET() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return NextResponse.json({
        status: "DIAGNOSTIC",
        env: {
            CLOUDINARY_CLOUD_NAME: cloudName ? "LOADED" : "MISSING",
            CLOUDINARY_API_KEY: apiKey ? "LOADED" : "MISSING",
            CLOUDINARY_API_SECRET: apiSecret ? "LOADED" : "MISSING",
        }
    });
}

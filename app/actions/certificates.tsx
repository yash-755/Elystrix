"use server"

import { prisma } from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/cloudinary"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { PDFDocument } from "pdf-lib"
import { CertificateRenderer } from "@/components/certificates/CertificateRenderer"
import path from "path"
import fs from "fs/promises"
import { revalidatePath } from "next/cache"
// Font loaders
async function loadFonts() {
    const baseUrl = "https://github.com/google/fonts/raw/main/ofl";

    // We need 3 fonts to match the design
    // 1. Serif: Playfair Display (for Name, Title)
    // 2. Sans: Inter (for body)
    // 3. Signature: Great Vibes

    const [serif, sans, signature] = await Promise.all([
        fetch(`${baseUrl}/playfairdisplay/PlayfairDisplay-Bold.ttf`).then(res => res.arrayBuffer()),
        fetch(`${baseUrl}/inter/Inter-Regular.ttf`).then(res => res.arrayBuffer()),
        fetch(`${baseUrl}/greatvibes/GreatVibes-Regular.ttf`).then(res => res.arrayBuffer())
    ]);

    return [
        { name: "Serif", data: serif, weight: 700 as const, style: "normal" as const },
        { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
        { name: "Great Vibes", data: signature, weight: 400 as const, style: "normal" as const },
    ];
}

async function getTemplateImageBase64(type: string) {
    const map: Record<string, string> = {
        PREMIUM: "premium-certificate-template.png",
        BASIC: "basic-certificate-template.png",
        // Legacy fallback
        L1: "premium-certificate-template.png",
        L2: "basic-certificate-template.png", // Mapping L2 to Basic
        L3: "basic-certificate-template.png",
    };

    const filename = map[type] || map.BASIC;
    const filePath = path.join(process.cwd(), "public", filename);
    const buffer = await fs.readFile(filePath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
}

export async function generateCertificateAssets(certificateId: string) {
    try {
        console.log(`[CertGen] Starting generation for ${certificateId}`);

        // 1. Fetch Data
        // Using raw prisma call, so we get 'tier' (mapped field)
        const cert = await prisma.certificate.findUnique({ where: { id: certificateId } });
        if (!cert) throw new Error("Certificate not found");

        if (cert.imageUrl && cert.pdfUrl) {
            console.log("[CertGen] Assets already exist. Skipping.");
            return { success: true, imageUrl: cert.imageUrl, pdfUrl: cert.pdfUrl };
        }

        // Determine effective type from legacy or new values
        let certType: "BASIC" | "PREMIUM" = "BASIC";
        // 'tier' is the DB field name. It might hold "L1", "L2", "BASIC", "PREMIUM"
        const tierValue = cert.tier || (cert as any).certificateType; // Handle both if prisma types fluctuate

        if (tierValue === "PREMIUM" || tierValue === "L1") {
            certType = "PREMIUM";
        }

        // 2. Prepare Resources
        const fonts = await loadFonts();
        const base64Template = await getTemplateImageBase64(certType);

        // 3. Render to SVG (Satori)
        const svg = await satori(
            <CertificateRenderer
                studentName={cert.studentName}
                courseName={cert.courseName}
                instructorName={cert.instructorName}
                issueDate={cert.issueDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                credentialId={cert.credentialId}
                certificateType={certType}
                bgImageSrc={base64Template} // Inject base64 template
            />,
            {
                width: 4096,
                height: 2728,
                fonts: fonts.map(f => ({
                    name: f.name,
                    data: f.data,
                    weight: f.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
                    style: f.style
                })),
            }
        );

        console.log("[CertGen] SVG Generated");

        // 4. Rasterize to PNG (Resvg)
        const resvg = new Resvg(svg, {
            fitTo: { mode: "width", value: 4096 },
        });
        const pngBuffer = resvg.render().asPng();

        // 5. Create PDF (PDF-Lib)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([842, 595]);
        const pngImage = await pdfDoc.embedPng(pngBuffer);

        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: page.getHeight(),
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);

        console.log("[CertGen] PDF Generated");

        // 6. Upload to Cloudinary
        const pngUpload = await uploadToCloudinary(pngBuffer, "elystrix/certificates/images", "image");
        const pdfUpload = await uploadToCloudinary(pdfBuffer, "elystrix/certificates/pdfs", "auto");

        // 7. Update Database
        await prisma.certificate.update({
            where: { id: certificateId },
            data: {
                imageUrl: pngUpload.url,
                pdfUrl: pdfUpload.url,
            },
        });

        console.log("[CertGen] Success");
        revalidatePath(`/dashboard/certificates/${certificateId}`);
        revalidatePath("/dashboard/certificates");
        revalidatePath("/dashboard");
        return { success: true };

    } catch (error: any) {
        console.error("[CertGen] Error:", error);
        return { success: false, error: error.message };
    }
}

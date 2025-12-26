"use server"

import { prisma } from "@/lib/prisma";
import { ensureUser, getUserByFirebaseId } from "@/lib/users";
import { revalidatePath } from "next/cache";

// -------------------------
// 1. Types & Interfaces
// -------------------------

export interface Certificate {
    id: string;             // Prisma properties
    credentialId: string;
    userId: string;
    courseId: string;

    // Snapshots (Immutable)
    studentName: string;
    courseName: string;
    instructorName: string;
    certificateType: "BASIC" | "PREMIUM";

    // Metadata
    issueDate: string;
    createdAt: any;
    verificationUrl: string;
    imageUrl?: string | null;
    pdfUrl?: string | null;
}

export type CertificateType = "BASIC" | "PREMIUM";

// -------------------------
// 2. Generators
// -------------------------

const TIER_CODES: Record<CertificateType, string> = {
    "PREMIUM": "PRM", // Premium
    "BASIC": "BAS"  // Basic
};

function generateCandidateId(type: CertificateType): string {
    const code = TIER_CODES[type];
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ELY-${code}-${year}-${random}`;
}

async function generateUniqueCredentialId(type: CertificateType): Promise<string> {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        const candidateId = generateCandidateId(type);

        const existing = await prisma.certificate.findUnique({
            where: { credentialId: candidateId }
        });

        if (!existing) {
            return candidateId;
        }
        attempts++;
    }

    throw new Error("Failed to generate unique Credential ID after 3 attempts.");
}

// -------------------------
// 3. Core Logic
// -------------------------

export interface CreateCertificateParams {
    userId: string; // Firebase UID
    courseId: string;
    studentName: string;
    courseName: string;
    instructorName: string;
    type: CertificateType;
}

export async function createCertificate(params: CreateCertificateParams): Promise<Certificate> {
    const { userId: firebaseUid, courseId, type } = params;

    // 1. Resolve / Create User
    // Note: Ideally email is passed, but for migration fallback we use placeholder if new
    const user = await ensureUser(firebaseUid, `${firebaseUid}@placeholder.com`, params.studentName);

    // 2. Check Existence (Idempotency)
    const existing = await prisma.certificate.findFirst({
        where: {
            userId: user.id,
            courseId: courseId
        }
    });

    if (existing) {
        console.log("Certificate already exists, returning existing record.");
        return mapPrismaToCertificate(existing);
    }

    // 3. Enforce Final Quiz Rule
    const finalQuiz = await prisma.quiz.findFirst({
        where: {
            courseId: courseId,
            type: "FINAL_QUIZ"
        }
    });

    if (finalQuiz) {
        const passedAttempt = await prisma.quizAttempt.findFirst({
            where: {
                quizId: finalQuiz.id,
                userId: user.id,
                passed: true
            }
        });

        if (!passedAttempt) {
            throw new Error("You must pass the Final Course Quiz to earn this certificate.");
        }
    }

    // 4. Generate Unique Credential ID
    const credentialId = await generateUniqueCredentialId(type);

    // 4. Create in MongoDB
    const newCert = await prisma.certificate.create({
        data: {
            userId: user.id,
            courseId,
            credentialId,
            studentName: params.studentName,
            courseName: params.courseName,
            instructorName: params.instructorName,
            certificateType: type, // Uses the mapped field 'tier' in DB
            issueDate: new Date(),
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/certificates");

    return mapPrismaToCertificate(newCert);
}

export async function getUserCertificates(firebaseUid: string): Promise<Certificate[]> {
    const user = await getUserByFirebaseId(firebaseUid);
    if (!user) return [];

    const certs = await prisma.certificate.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return certs.map(mapPrismaToCertificate);
}

export async function getCertificateByCredentialId(credentialId: string): Promise<Certificate | null> {
    const cert = await prisma.certificate.findUnique({
        where: { credentialId }
    });

    if (!cert) return null;
    return mapPrismaToCertificate(cert);
}

// Helper to map Prisma result to the interface UI expects
function mapPrismaToCertificate(p: any): Certificate {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Backward compatibility mapping
    let mappedType: CertificateType = "BASIC";
    if (p.certificateType === "PREMIUM" || p.certificateType === "L1") {
        mappedType = "PREMIUM";
    } else if (p.certificateType === "BASIC" || p.certificateType === "L2" || p.certificateType === "L3") {
        mappedType = "BASIC";
    } else {
        // Fallback checks on old direct field access if prisma didn't map it yet (though our schema map handles it)
        // If raw access to 'tier' was needed, we'd check p.tier but p.certificateType is what we asked for in prisma schema
        if (p.tier === "L1") mappedType = "PREMIUM";
    }

    return {
        id: p.id,
        credentialId: p.credentialId,
        userId: p.userId,
        courseId: p.courseId,
        studentName: p.studentName,
        courseName: p.courseName,
        instructorName: p.instructorName,
        certificateType: mappedType,
        issueDate: p.issueDate.toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        }),
        createdAt: p.createdAt,
        verificationUrl: `${baseUrl}/verify/${p.credentialId}`,
        imageUrl: p.imageUrl,
        pdfUrl: p.pdfUrl
    };
}


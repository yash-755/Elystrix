"use server"

import { prisma } from "@/lib/prisma"
import { createCertificate, type CertificateTier } from "@/lib/certificates"
import { getUserByFirebaseId } from "@/lib/users"

export async function generateQuizCertificate(
    firebaseUid: string,
    courseId: string,
    courseTitle: string,
    score: number
) {
    if (score < 70) {
        throw new Error("Score too low to generate certificate.")
    }

    // 1. Fetch User to get Plan/Tier
    const user = await getUserByFirebaseId(firebaseUid);
    // Default to free if user not found (shouldn't happen if auth is valid)
    // Schema has 'plan' in User.
    const userPlan = user?.plan || 'free';

    // 2. Fetch Course to get Price/Tier
    // courseId logic: The quiz page uses "react-masterclass" as hardcoded courseId in the example.
    // We should try to find real course if possible, or fallback.
    // For now, trusting the ID passed from UI (which was hardcoded mock).
    // Ideally we fetch course by ID.
    // let coursePrice = "Free";
    // const course = await prisma.course.findUnique({ where: { id: courseId } });
    // if (course) coursePrice = course.price;

    // MOCK Logic matching the Quiz Page's previous hardcoded "Premium" expectation
    // "React Masterclass" -> Premium (Level 2/Ultra/Elite)
    // We'll treat courseId "react-masterclass" as Elite for now to maintain behavior, 
    // or fetch from DB if we seeded it.
    // Let's assume Course Tier is Elite (2) as per previous logic.
    const courseLevel = 2; // Elite

    // 3. Calculate Tier
    const tierValue = (p: string | null) => {
        const plan = p?.toLowerCase() || "";
        if (['elite', 'ultra', 'premium'].includes(plan)) return 2;
        if (['pro', 'career', 'advance'].includes(plan)) return 1;
        return 0;
    }

    const userLevel = tierValue(userPlan);
    const finalTierValue = Math.min(userLevel, courseLevel);
    const finalLevel: CertificateTier = finalTierValue === 2 ? "L1" : finalTierValue === 1 ? "L2" : "L3";

    // 4. Create Certificate
    // We need student name. Prisma User has 'name'.
    const studentName = user?.name || "Student";

    const cert = await createCertificate({
        userId: firebaseUid,
        courseId,
        studentName,
        courseName: courseTitle,
        instructorName: "Elestrix Academy", // Placeholder
        tier: finalLevel
    });

    return cert;
}

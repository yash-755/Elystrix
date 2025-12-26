import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

/**
 * Get current logged-in user from session/cookies
 * This is a server-side helper for use in Server Components and API routes
 */
export async function getCurrentUser() {
    try {
        // Get Firebase auth token from cookies
        // Note: This assumes Firebase auth sets a cookie. Adjust based on your auth setup.
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session") // Adjust cookie name as needed

        if (!sessionCookie) {
            return null
        }

        // In a real implementation, verify the session token with Firebase Admin SDK
        // For now, we'll use a simplified approach - decode or verify your session
        // This is a placeholder - implement proper Firebase auth verification

        // Temporary: Extract firebaseUid from cookie value (implement proper verification)
        // You should use Firebase Admin SDK verifyIdToken or verifySessionCookie
        try {
            // Placeholder - replace with real Firebase session verification
            const sessionData = JSON.parse(sessionCookie.value)
            const firebaseUid = sessionData.uid

            if (!firebaseUid) {
                return null
            }

            // Fetch user from database
            const user = await prisma.user.findUnique({
                where: { firebaseUid },
            })

            return user
        } catch (error) {
            return null
        }
    } catch (error) {
        console.error("getCurrentUser error:", error)
        return null
    }
}

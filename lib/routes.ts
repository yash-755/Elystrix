import { User } from "firebase/auth";

/**
 * Returns the appropriate home route based on the user's authentication state and role.
 * 
 * @param user - The Firebase User object or null.
 * @param role - The user's role (optional, e.g. "admin" or "student").
 * @returns The path to redirect to ("/" for logged out, "/dashboard" or "/admin" for logged in).
 */
export function getHomeRoute(user: User | null, role?: string): string {
    if (!user) {
        return "/";
    }

    if (role === "admin") {
        return "/admin";
    }

    // Default for logged-in users (students, undefined role, etc.)
    return "/dashboard";
}

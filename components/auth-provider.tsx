"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ensureUser } from "@/lib/users"

interface AuthContextType {
    user: User | null
    role: string | null // Add role to context
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null) // State for role
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setUser(user)
            if (user) {
                // Sync Firebase User to MongoDB (Prisma)
                try {
                    const dbUser = await ensureUser(user.uid, user.email || "", user.displayName || null);
                    setRole(dbUser.role); // Set role from DB
                } catch (err) {
                    console.error("Failed to sync user to DB", err);
                    setRole("student"); // Fallback
                }
            } else {
                setRole(null);
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signOut = async () => {
        await firebaseSignOut(auth)
        setRole(null) // Clear role on signout
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

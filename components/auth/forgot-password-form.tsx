"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Map Firebase error codes to user-friendly messages
function getPasswordResetErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case "auth/user-not-found":
            return "No account found with this email."
        case "auth/invalid-email":
            return "Please enter a valid email address."
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later."
        default:
            return "Failed to send reset email. Please try again."
    }
}

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("") // Clear any existing errors
        setSuccess(false) // Clear success state

        try {
            await sendPasswordResetEmail(auth, email)
            setSuccess(true)
            setEmail("") // Clear email field on success
        } catch (error: any) {
            const errorCode = error?.code || ""
            const errorMessage = getPasswordResetErrorMessage(errorCode)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // Clear error and success when user starts typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (error) {
            setError("")
        }
        if (success) {
            setSuccess(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="pl-10 bg-transparent"
                        value={email}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/20 border border-red-900/50 text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-950/20 border border-green-900/50 text-green-400">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm">Password reset link has been sent to your email.</p>
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow-sm h-11"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Send Reset Link"
                )}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to Login
                </Link>
            </div>
        </form>
    )
}

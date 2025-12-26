import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { LandingGuard } from "@/components/landing-guard"

export default function ForgotPasswordPage() {
    return (
        <LandingGuard>
            <div className="min-h-screen flex">
                {/* Left Panel - Form */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="absolute top-6 left-6">
                        <Link href="/">
                            <Logo size="sm" />
                        </Link>
                    </div>
                    <div className="absolute top-6 right-6">
                        <ThemeToggle />
                    </div>

                    <div className="mx-auto w-full max-w-md">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                            <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
                        </div>

                        <ForgotPasswordForm />
                    </div>
                </div>

                {/* Right Panel - Decorative */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-muted/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 gold-glow">
                            <span className="text-4xl font-bold text-primary-foreground">E</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Learn Smarter</h2>
                        <p className="text-muted-foreground max-w-sm">
                            Access 500+ curated courses, earn verified certificates, and advance your career.
                        </p>

                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-8">
                            <div>
                                <p className="text-2xl font-bold text-primary">50K+</p>
                                <p className="text-sm text-muted-foreground">Students</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">500+</p>
                                <p className="text-sm text-muted-foreground">Courses</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">25K+</p>
                                <p className="text-sm text-muted-foreground">Certificates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LandingGuard>
    )
}

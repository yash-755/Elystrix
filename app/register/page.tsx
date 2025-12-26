import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { RegisterForm } from "@/components/auth/register-form"
import { LandingGuard } from "@/components/landing-guard"

export default function RegisterPage() {
  return (
    <LandingGuard>
      <div className="min-h-screen flex">
        {/* Left Panel - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-muted/30">
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-transparent to-primary/5" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 gold-glow">
              <span className="text-4xl font-bold text-primary-foreground">E</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Start Learning Today</h2>
            <p className="text-muted-foreground max-w-sm">
              Join 50,000+ students who are advancing their careers with verified certificates.
            </p>

            {/* Features */}
            <div className="mt-12 space-y-4 text-left">
              {[
                "Access to 500+ curated courses",
                "Earn Premium, Career & Basic certificates",
                "Learn from the best YouTube content",
                "Track your progress with detailed analytics",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
              <p className="text-muted-foreground">Start your learning journey with Elystrix</p>
            </div>

            <RegisterForm />

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </LandingGuard>
  )
}

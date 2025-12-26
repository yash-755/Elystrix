"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, CheckCircle, XCircle, Award, Calendar, User, BookOpen } from "lucide-react"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle")

  const handleVerify = () => {
    // Simulate verification
    if (code.length > 0) {
      setStatus(code === "ELYX-2024-ABC123" ? "valid" : "invalid")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Verify Certificate</h1>
                <p className="text-lg text-muted-foreground">Enter a certificate code to verify its authenticity</p>
              </div>

              {/* Verification Form */}
              <div className="bg-card rounded-2xl border border-border p-8 mb-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Certificate Code</Label>
                    <div className="flex gap-3">
                      <Input
                        id="code"
                        placeholder="e.g., ELYX-2024-ABC123"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value)
                          setStatus("idle")
                        }}
                        className="bg-transparent font-mono uppercase"
                      />
                      <Button
                        onClick={handleVerify}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The certificate code can be found at the bottom of any Elystrix certificate.
                  </p>
                </div>
              </div>

              {/* Result */}
              {status === "valid" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Certificate Verified</h3>
                      <p className="text-sm text-green-500">This certificate is authentic</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issued To</p>
                        <p className="font-medium text-foreground">John Smith</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium text-foreground">React Fundamentals: From Zero to Hero</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-medium text-foreground">December 1, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-[#C0C0C0]" />
                      <div>
                        <p className="text-sm text-muted-foreground">Certificate Level</p>
                        <p className="font-medium text-foreground">Career (L2)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status === "invalid" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Certificate Not Found</h3>
                      <p className="text-sm text-red-500">
                        We couldn&apos;t find a certificate with this code. Please check and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

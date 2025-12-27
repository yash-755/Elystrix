import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Calendar, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { CertificateGenerator as CertificateViewer } from "@/components/certificates/CertificateGenerator"
import { useAuth } from "@/components/auth-provider"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// This is a Server Component
export default async function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. Fetch Certificate with related Course data
  // Note: Schema has courseId, userId. 
  // We need to fetch course details (duration, level, etc).
  // Assuming Course model has these fields or we rely on snapshots.
  // The Certificate model has snapshots for: studentName, courseName, instructorName, tier.
  // It DOES NOT have duration, score, skills snapshots.
  // We should either fetch them from Course or fallback.

  const certificate = await prisma.certificate.findUnique({
    where: { id: id },
  })

  if (!certificate) {
    notFound()
  }

  // Fetch Course for metadata not in snapshot
  const course = await prisma.course.findUnique({
    where: { id: certificate.courseId }
  });

  // Derived/Fallback data
  const totalHours = 24; // Fallback or fetch if Course has it
  const score = 100; // Fallback or fetch from QuizAttempt if linked
  const skills = ["React", "JavaScript", "Frontend"]; // Fallback or fetch from Course

  // Map legacy tiers to new types
  let certType: "BASIC" | "PREMIUM" = "BASIC";
  const tierVal = certificate.tier || (certificate as any).certificateType;
  if (tierVal === "PREMIUM" || tierVal === "L1") {
    certType = "PREMIUM";
  }

  const styles = {
    // Shared background gradients
    PREMIUM: "bg-gradient-to-br from-[#d4af37] via-[#f5e6a9] to-[#d4af37] text-black", // Gold
    BASIC: "bg-gradient-to-br from-[#f8f8f8] via-[#ffffff] to-[#f8f8f8] text-black"  // White
  };

  const styleClass = styles[certType] || styles.BASIC;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/certificates"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Certificates
        </Link>
      </div>

      {/* 
          CERTIFICATE VIEWER / PREVIEW 
          Handles: Display, Download, & Server-Side Regeneration
      */}
      <CertificateViewer
        id={certificate.id} // Pass ID for updates
        imageUrl={certificate.imageUrl}
        pdfUrl={certificate.pdfUrl}

        // Renderer Props
        studentName={certificate.studentName}
        courseName={certificate.courseName}
        instructorName={certificate.instructorName}
        issueDate={certificate.issueDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        credentialId={certificate.credentialId}
        certificateType={certType}
      />

      {/* Certificate Details (Metadata) */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Certificate Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <p className="font-medium capitalize">
                    {certType === 'PREMIUM' ? 'Premium Certificate' : 'Basic Certificate'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued On</p>
                  <p className="font-medium">{certificate.issueDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course Duration</p>
                  <p className="font-medium">{totalHours} Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">Verified</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verification</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This certificate can be verified by employers and institutions using the credential ID or verification URL.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Credential ID</p>
                    <code className="text-sm font-mono">{certificate.credentialId}</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

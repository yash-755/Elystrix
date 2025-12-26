"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CertificateCard } from "@/components/certificate-card"
import { getUserCertificates, Certificate } from "@/lib/certificates"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function MyCertificatesPage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function fetchCertificates() {
      if (!user) return
      try {
        const data = await getUserCertificates(user.uid)
        setCertificates(data)
      } catch (error) {
        console.error("Failed to fetch certificates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [user])

  const filteredCertificates = certificates.filter((cert) => {
    if (filter === "all") return true
    return cert.certificateTier === filter
  })

  // Map Firestore/Logic data to UI Card props
  const mapToCardProps = (cert: Certificate) => ({
    id: cert.id,
    courseName: cert.courseName,
    studentName: cert.studentName,
    issueDate: cert.issueDate,
    verificationCode: cert.credentialId,
    level: cert.certificateTier,
    pdfUrl: cert.pdfUrl,
    verificationUrl: cert.verificationUrl,
  })

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">My Certificates</h1>
        <p className="text-muted-foreground">View, download, and share your earned certificates</p>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({certificates.length})</TabsTrigger>
          <TabsTrigger value="L1">Premium ({certificates.filter((c) => c.certificateTier === "L1").length})</TabsTrigger>
          <TabsTrigger value="L2">Career ({certificates.filter((c) => c.certificateTier === "L2").length})</TabsTrigger>
          <TabsTrigger value="L3">Basic ({certificates.filter((c) => c.certificateTier === "L3").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <CertificateCard key={certificate.id} {...mapToCardProps(certificate)} />
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No certificates found in this category.</p>
        </div>
      )}
    </div>
  )
}

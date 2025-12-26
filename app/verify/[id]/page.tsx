"use client"

import { useEffect, useState, use } from "react"
import { getCertificateByCredentialId, Certificate } from "@/lib/certificates"
import { CertificateGenerator } from "@/components/certificates/CertificateGenerator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Search, Award } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function VerificationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [cert, setCert] = useState<Certificate | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Use the ID from URL parameters
    useEffect(() => {
        const fetchCert = async () => {
            try {
                const data = await getCertificateByCredentialId(id);
                if (data) {
                    setCert(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCert();
        }
    }, [id]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !cert) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Invalid Certificate</h1>
                    <p className="text-gray-500 mb-6">The certificate ID you provided could not be found or has been revoked.</p>
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Status */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                        <CheckCircle2 size={20} />
                        <span className="font-semibold">Crednetial Verified</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
                    <p className="text-gray-500 mt-2">Verified authentic certificate issued by Elestrix Learning.</p>
                </div>

                {/* Certificate Display */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="transform scale-90 origin-top">
                            <CertificateGenerator
                                id={cert.id}
                                studentName={cert.studentName}
                                courseName={cert.courseName}
                                issueDate={cert.issueDate}
                                credentialId={cert.credentialId}
                                instructorName={cert.instructorName}
                                certificateType={cert.certificateType}
                            />
                        </div>
                    </div>
                </div>
                {/* Details Card */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Award className="text-primary" />
                            Credential Details
                        </h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Recipient</dt>
                                <dd className="font-medium">{cert.studentName}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Course</dt>
                                <dd className="font-medium">{cert.courseName}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Issue Date</dt>
                                <dd className="font-medium">{cert.issueDate}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Credential ID</dt>
                                <dd className="font-mono">{cert.credentialId}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Certificate Type</dt>
                                <dd className="font-medium">
                                    {cert.certificateType === "PREMIUM" ? "Premium Certificate" : "Basic Certificate"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Instructor</dt>
                                <dd className="font-medium">{cert.instructorName}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

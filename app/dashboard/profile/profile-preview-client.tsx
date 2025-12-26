"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { getUserProfile } from "@/app/actions/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, MapPin, Mail, Phone, Globe, Linkedin, Twitter, Github, Edit, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getUserCertificates, Certificate } from "@/lib/certificates"
import { CertificateCard } from "@/components/certificate-card"

export default function ProfilePreviewClient() {
    const [user, loadingAuth] = useAuthState(auth)
    const [dbUser, setDbUser] = useState<any>(null)
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            if (user?.uid) {
                setLoadingData(true)
                try {
                    const profile = await getUserProfile(user.uid)
                    setDbUser(profile)

                    // Fetch Certificates
                    const userCerts = await getUserCertificates(user.uid)
                    setCertificates(userCerts)
                } catch (e) {
                    console.error(e)
                    toast.error("Failed to load profile")
                } finally {
                    setLoadingData(false)
                }
            } else if (!loadingAuth && !user) {
                setLoadingData(false)
            }
        }
        fetchProfile()
    }, [user, loadingAuth])

    if (loadingAuth || loadingData) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground">Please log in to view your profile.</div>
    }

    // Helper to ensure no random fallbacks
    const displayValue = (val: string | null | undefined) => val || null

    const ensureExternal = (url: string | null | undefined) => {
        if (!url) return undefined
        if (url.startsWith("http://") || url.startsWith("https://")) return url
        return `https://${url}`
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="relative mb-20">
                <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl" />
                <div className="absolute -bottom-16 left-8 flex items-end gap-6 text-left">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                        <AvatarImage src={displayValue(dbUser?.profileImageUrl) ?? undefined} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-muted">
                            {dbUser?.name?.slice(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-4 space-y-1">
                        <h1 className="text-3xl font-bold text-foreground">{displayValue(dbUser?.name)}</h1>
                        <p className="text-lg text-muted-foreground font-medium">{displayValue(dbUser?.headline)}</p>

                        {/* Location */}
                        {(dbUser?.city || dbUser?.state || dbUser?.country) && (
                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {[dbUser.city, dbUser.state, dbUser.country].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute -bottom-12 right-8">
                    <Link href="/dashboard/settings?tab=profile">
                        <Button variant="default" className="gap-2">
                            <Edit className="w-4 h-4" /> Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {/* Left Column (Aside) */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-foreground">Contact</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground overflow-hidden">
                                    <Mail className="w-4 h-4 shrink-0" />
                                    <span className="truncate" title={dbUser?.email}>{displayValue(dbUser?.email)}</span>
                                </div>
                                {dbUser?.phone && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-4 h-4 shrink-0" />
                                        <span>{dbUser.phone}</span>
                                    </div>
                                )}
                                {dbUser?.website && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Globe className="w-4 h-4 shrink-0" />
                                        <a href={ensureExternal(dbUser.website)} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">
                                            Website
                                        </a>
                                    </div>
                                )}
                            </div>

                            {(dbUser?.linkedinProfile || dbUser?.twitterProfile || dbUser?.githubProfile) && (
                                <>
                                    <Separator />
                                    <div className="flex actions gap-4 pt-2">
                                        {dbUser?.linkedinProfile && (
                                            <a href={ensureExternal(dbUser.linkedinProfile)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0077b5] transition-colors">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {dbUser?.twitterProfile && (
                                            <a href={ensureExternal(dbUser.twitterProfile)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {dbUser?.githubProfile && (
                                            <a href={ensureExternal(dbUser.githubProfile)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-foreground">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {dbUser?.skills?.length > 0 ? (
                                    dbUser.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="px-2 py-1 font-normal">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">No skills added yet.</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Main Content) */}
                <div className="md:col-span-2 space-y-6">
                    {/* About */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-lg text-foreground">About</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {displayValue(dbUser?.bio) || <span className="italic opacity-50">No bio added.</span>}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Experience / Career Intent */}
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                Career Path
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Current Status</span>
                                    <p className="mt-1 font-medium">{displayValue(dbUser?.careerStatus) || "Not specified"}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Target Role</span>
                                    <p className="mt-1 font-medium text-primary">{displayValue(dbUser?.targetRole) || "Not specified"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Education
                            </h3>

                            {dbUser?.degree || dbUser?.college ? (
                                <div className="relative pl-6 border-l-2 border-muted pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground text-lg">{dbUser.degree || "Degree Not Listed"}</h4>
                                        <p className="text-muted-foreground">{dbUser.college || "University Not Listed"}</p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Badge variant="outline" className="text-xs rounded-sm">
                                                {dbUser.graduationYear ? `Class of ${dbUser.graduationYear}` : "Year Not Listed"}
                                            </Badge>
                                            {dbUser.qualification && (
                                                <Badge variant="outline" className="text-xs rounded-sm">
                                                    {dbUser.qualification}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic text-sm">No education details added.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Certificates Earned */}
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Certificates Earned
                            </h3>

                            {certificates.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {certificates.map((cert) => (
                                        <CertificateCard
                                            key={cert.id}
                                            id={cert.id}
                                            courseName={cert.courseName}
                                            issueDate={cert.issueDate}
                                            level={cert.certificateTier}
                                            verificationCode={cert.credentialId}
                                            studentName={cert.studentName}
                                            pdfUrl={cert.pdfUrl}
                                            verificationUrl={cert.verificationUrl}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic text-sm">No certificates earned yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

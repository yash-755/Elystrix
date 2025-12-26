"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Linkedin, Twitter, Github, Globe } from "lucide-react"

interface SocialsProps {
    user: any
    onSave: (data: any) => Promise<void>
    saving: boolean
}

export function SocialsCard({ user, onSave, saving }: SocialsProps) {
    const [linkedinProfile, setLinkedin] = useState(user?.linkedinProfile || "")
    const [twitterProfile, setTwitter] = useState(user?.twitterProfile || "")
    const [githubProfile, setGithub] = useState(user?.githubProfile || "")
    const [website, setWebsite] = useState(user?.website || "")

    useEffect(() => {
        if (user) {
            setLinkedin(user.linkedinProfile || "")
            setTwitter(user.twitterProfile || "")
            setGithub(user.githubProfile || "")
            setWebsite(user.website || "")
        }
    }, [user])

    const normalizeUrl = (url: string) => {
        if (!url) return ""
        if (url.startsWith("http://") || url.startsWith("https://")) return url
        return `https://${url}`
    }

    const handleSubmit = () => {
        onSave({
            linkedinProfile: normalizeUrl(linkedinProfile),
            twitterProfile: normalizeUrl(twitterProfile),
            githubProfile: normalizeUrl(githubProfile),
            website: normalizeUrl(website)
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Where can people find you online?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
                    <Input id="linkedin" value={linkedinProfile} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
                    <Input id="github" value={githubProfile} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter / X</Label>
                    <Input id="twitter" value={twitterProfile} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2"><Globe className="w-4 h-4" /> Portfolio / Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://your-portfolio.com" />
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSubmit} disabled={saving} variant="outline">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Links"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

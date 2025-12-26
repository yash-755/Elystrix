"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { uploadUserProfileImage } from "@/app/actions/upload"
import { updateProfile } from "firebase/auth"
import type { User as FirebaseUser } from "firebase/auth"

interface ProfileHeaderProps {
    user: any
    firebaseUser: FirebaseUser | null | undefined
    onSave: (data: any) => Promise<void>
    saving: boolean
}

export function ProfileHeader({ user, firebaseUser, onSave, saving }: ProfileHeaderProps) {
    const [uploading, setUploading] = useState(false)
    const [headline, setHeadline] = useState(user?.headline || "")
    const [name, setName] = useState(user?.name || "")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !firebaseUser) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB")
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const result = await uploadUserProfileImage(formData, firebaseUser.uid)
            if (!result.success || !result.url) throw new Error(result.error || "Upload failed")

            // Update Firebase Auth
            await updateProfile(firebaseUser, { photoURL: result.url })

            // Force refresh or callback to parent to update local state? 
            // The parent fetches on mount, but we want immediate feedback.
            // We can call onSave with partial update or just reload.
            // Ideally parent handles state update.
            window.location.reload() // Simple sync for now, or parent could expose setDbUser
            toast.success("Photo updated")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = () => {
        onSave({ name, headline })
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user?.profileImageUrl || firebaseUser?.photoURL || "/diverse-avatars.png"} />
                    <AvatarFallback>{name?.slice(0, 2).toUpperCase() || "ST"}</AvatarFallback>
                </Avatar>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    disabled={uploading}
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex-1 space-y-4 w-full">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                            id="headline"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g. Aspiring Frontend Developer | CS Student"
                            maxLength={100}
                        />
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
    )
}

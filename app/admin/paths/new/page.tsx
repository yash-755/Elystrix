"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createLearningPath } from "@/app/actions/learning-paths"
import Link from "next/link"

export default function NewPathPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        // Generate a simple slug
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

        const res = await createLearningPath({ title, slug })

        if (res.success && res.data) {
            toast.success("Path created successfully")
            router.push(`/admin/paths/${res.data.id}/builder`)
        } else {
            toast.error(res.error || "Failed to create path. Slug might be duplicate.")
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10">
            <Link href="/admin/paths">
                <Button variant="ghost" className="mb-4 pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Paths
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Learning Path</CardTitle>
                    <CardDescription>Start by giving your path a name. You can add nodes and details later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Path Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Full Stack Developer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!title.trim() || loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create & Open Builder
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

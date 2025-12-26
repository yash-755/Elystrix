"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ArrowUp, ArrowDown, Plus, Trash2, BookOpen,
    ArrowLeft, Loader2, Link as LinkIcon, ExternalLink, Check, Search
} from "lucide-react"
import { toast } from "sonner"
import {
    getLearningPathById,
    updateLearningPath,
    addNodeToPath,
    deleteNode,
    swapNodesOrder,
    updateNode,
    getAllCoursesForSelector,
    attachCourseToNode,
    removeCourseFromNode
} from "@/app/actions/learning-paths"
import { cn } from "@/lib/utils"

// Types
type Node = {
    id: string
    title: string
    description: string | null
    type: string
    difficulty: string
    order: number
    courses: any[]
}

type Path = {
    id: string
    title: string
    description: string | null
    slug: string
    published: boolean
    level: string
    nodes: Node[]
}

export default function PathBuilderPage() {
    const params = useParams()
    const router = useRouter()
    const [path, setPath] = useState<Path | null>(null)
    const [loading, setLoading] = useState(true)
    const [courses, setCourses] = useState<any[]>([])

    // Edit Path State
    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [metaForm, setMetaForm] = useState({ title: "", description: "", certificateType: "BASIC" })

    // UI States
    const [managingNode, setManagingNode] = useState<Node | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    // Load Data
    const loadData = async () => {
        setLoading(true)
        const [pathRes, coursesRes] = await Promise.all([
            getLearningPathById(params.id as string),
            getAllCoursesForSelector()
        ])

        if (pathRes) {
            setPath(pathRes as any)
            setMetaForm({
                title: pathRes.title,
                description: pathRes.description || "",
                certificateType: (pathRes as any).certificateType || "BASIC"
            })
        }
        if (coursesRes) setCourses(coursesRes)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const refreshPath = async () => {
        const res = await getLearningPathById(params.id as string)
        if (res) setPath(res as any)
    }

    // --- Path Handlers ---

    const handlePublishToggle = async () => {
        if (!path) return
        const newVal = !path.published
        const res = await updateLearningPath(path.id, { published: newVal })
        if (res.success) {
            toast.success(newVal ? "Path Published" : "Path Unpublished")
            setPath({ ...path, published: newVal })
        } else {
            toast.error("Failed to update status")
        }
    }

    const handleSaveMeta = async () => {
        if (!path) return
        const res = await updateLearningPath(path.id, metaForm)
        if (res.success) {
            toast.success("Path Updated")
            setIsEditingMeta(false)
            setPath({ ...path, ...metaForm })
        } else {
            toast.error("Failed to update path")
        }
    }

    // --- Action Buttons ---

    const handleCopyLink = () => {
        // Use slug for public link if available, else ID
        const identifier = path?.slug || path?.id
        const url = `${window.location.origin}/paths/${identifier}`
        navigator.clipboard.writeText(url)
        toast.success("Public link copied to clipboard")
    }

    const handlePreview = () => {
        const identifier = path?.slug || path?.id
        window.open(`/paths/${identifier}`, '_blank')
    }

    // --- Node Handlers ---

    const handleAddNode = async () => {
        if (!path) return
        const res = await addNodeToPath(path.id, {
            title: "New Module",
            type: "core",
            difficulty: "Beginner"
        })
        if (res.success) {
            toast.success("Node Added")
            refreshPath()
        }
    }




    const handleDeleteNode = async (id: string) => {
        if (!confirm("Are you sure? This will delete the node and detach courses.")) return
        const res = await deleteNode(id)
        if (res.success) {
            toast.success("Node Deleted")
            refreshPath()
        }
    }

    const handleMoveNode = async (idx: number, direction: 'up' | 'down') => {
        if (!path) return
        const nodes = [...path.nodes]
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1

        if (targetIdx < 0 || targetIdx >= nodes.length) return

        const n1 = nodes[idx]
        const n2 = nodes[targetIdx]

        const res = await swapNodesOrder(n1.id, n2.id)
        if (res.success) {
            refreshPath()
        } else {
            toast.error("Failed to move node")
        }
    }

    const handleUpdateNode = async (id: string, data: any) => {
        await updateNode(id, data)
        toast.success("Node Updated", { duration: 1000 })
        refreshPath()
    }

    // --- Course Linking Handlers ---

    const handleToggleCourse = async (courseId: string) => {
        if (!managingNode) return
        const isLinked = managingNode.courses.some((c: any) => c.courseId === courseId)

        let res
        if (isLinked) {
            res = await removeCourseFromNode(managingNode.id, courseId)
        } else {
            res = await attachCourseToNode(managingNode.id, courseId)
        }

        if (res.success) {
            // Update local state immediately for responsiveness
            const updatedNode = { ...managingNode }
            if (isLinked) {
                updatedNode.courses = updatedNode.courses.filter((c: any) => c.courseId !== courseId)
                toast.success("Course removed", { duration: 1000 })
            } else {
                updatedNode.courses = [...updatedNode.courses, { courseId, course: courses.find(c => c.id === courseId) }]
                toast.success("Course linked", { duration: 1000 })
            }
            setManagingNode(updatedNode)
            refreshPath() // Sync full state
        } else {
            toast.error("Failed to update course link")
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
    if (!path) return <div>Path not found</div>

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6 pb-20">

            {/* Header / Meta */}
            <div className="flex flex-col gap-6 border-b pb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent" onClick={() => router.push("/admin/paths")}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Paths
                        </Button>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{path.title}</h1>
                            <Badge variant={path.published ? "default" : "secondary"}>
                                {path.published ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{path.description || "No description provided."}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyLink}>
                                <LinkIcon className="h-4 w-4 mr-2" /> Public Link
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePreview}>
                                <ExternalLink className="h-4 w-4 mr-2" /> Preview
                            </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button variant="secondary" onClick={() => setIsEditingMeta(!isEditingMeta)}>
                                Edit Details
                            </Button>
                            <Button
                                variant={path.published ? "destructive" : "default"}
                                className={!path.published ? "bg-green-600 hover:bg-green-700" : ""}
                                onClick={handlePublishToggle}
                            >
                                {path.published ? "Unpublish Path" : "Publish Path"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Edit Meta Form */}
                {isEditingMeta && (
                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle>Edit Path Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input value={metaForm.title} onChange={e => setMetaForm({ ...metaForm, title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Slug (URL Identifier)</Label>
                                <Input value={path.slug} disabled className="bg-muted text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">Slug is auto-generated and cannot be changed.</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea value={metaForm.description} onChange={e => setMetaForm({ ...metaForm, description: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Certificate Type</Label>
                                <select
                                    className="h-9 rounded-md border text-sm px-3 bg-background w-full"
                                    value={metaForm.certificateType}
                                    onChange={e => setMetaForm({ ...metaForm, certificateType: e.target.value })}
                                >
                                    <option value="BASIC">Basic Certificate</option>
                                    <option value="CAREER">Career Certificate</option>
                                    <option value="PREMIUM">Premium Certificate</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsEditingMeta(false)}>Cancel</Button>
                                <Button onClick={handleSaveMeta}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Nodes Builder */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Curriculum Roadmap</h2>
                        <p className="text-sm text-muted-foreground">Define the modules and link courses to them.</p>
                    </div>
                    <Button onClick={handleAddNode}>
                        <Plus className="h-4 w-4 mr-2" /> Add Module
                    </Button>
                </div>

                <div className="space-y-4">
                    {path.nodes.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-card">
                            <p className="text-muted-foreground mb-4">This path has no modules yet.</p>
                            <Button onClick={handleAddNode} variant="outline">Create First Module</Button>
                        </div>
                    )}

                    {path.nodes.map((node, idx) => (
                        <Card key={node.id} className="relative group border-2 hover:border-primary/20 transition-all">
                            <CardContent className="p-0 flex">
                                {/* Drag/Order Handle */}
                                <div className="border-r bg-muted/20 w-10 flex flex-col items-center justify-center gap-2 p-2 text-muted-foreground">
                                    <Button
                                        variant="ghost" size="icon" className="h-6 w-6"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveNode(idx, 'up')}
                                    >
                                        <ArrowUp className="h-3 w-3" />
                                    </Button>
                                    <span className="font-mono text-xs font-bold">{idx + 1}</span>
                                    <Button
                                        variant="ghost" size="icon" className="h-6 w-6"
                                        disabled={idx === path.nodes.length - 1}
                                        onClick={() => handleMoveNode(idx, 'down')}
                                    >
                                        <ArrowDown className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 p-5 grid gap-6 lg:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Module Info</Label>
                                            <Input
                                                defaultValue={node.title}
                                                className="font-bold text-lg"
                                                placeholder="Module Title"
                                                onBlur={(e) => {
                                                    if (e.target.value !== node.title) handleUpdateNode(node.id, { title: e.target.value })
                                                }}
                                            />
                                            <Textarea
                                                defaultValue={node.description || ""}
                                                placeholder="What will students learn in this module?"
                                                className="text-sm resize-none h-20"
                                                onBlur={(e) => {
                                                    if (e.target.value !== (node.description || "")) handleUpdateNode(node.id, { description: e.target.value })
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="h-9 rounded-md border text-sm px-3 bg-background"
                                                value={node.type}
                                                onChange={(e) => handleUpdateNode(node.id, { type: e.target.value })}
                                            >
                                                <option value="core">Core Requirement</option>
                                                <option value="optional">Optional / Bonus</option>
                                                <option value="capstone">Capstone Project</option>
                                            </select>
                                            <select
                                                className="h-9 rounded-md border text-sm px-3 bg-background"
                                                value={node.difficulty}
                                                onChange={(e) => handleUpdateNode(node.id, { difficulty: e.target.value })}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Linked Content</Label>
                                            <Button
                                                variant="outline" size="sm" className="h-7 text-xs"
                                                onClick={() => setManagingNode(node)}
                                            >
                                                Manage Courses
                                            </Button>
                                        </div>

                                        <div className="bg-muted/30 rounded-lg p-3 min-h-[120px] border">
                                            {node.courses.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm italic py-4">
                                                    <BookOpen className="h-5 w-5 mb-2 opacity-50" />
                                                    No courses linked yet
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {node.courses.map((nc: any) => (
                                                        <div key={nc.course.id} className="bg-background border rounded px-3 py-2 text-sm flex items-center justify-between">
                                                            <span className="truncate flex-1 font-medium">{nc.course.title}</span>
                                                            <Badge variant="outline" className="text-[10px] ml-2">{nc.course.difficulty}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <div className="p-2">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDeleteNode(node.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Manage Courses Dialog */}
            <Dialog open={!!managingNode} onOpenChange={(open) => !open && setManagingNode(null)}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Manage Courses for {managingNode?.title}</DialogTitle>
                        <CardDescription>Select courses to include in this learning module.</CardDescription>
                    </DialogHeader>

                    <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-2 pb-4">
                            {filteredCourses.map(course => {
                                const isSelected = managingNode?.courses.some((c: any) => c.courseId === course.id)
                                return (
                                    <div
                                        key={course.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                            isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                                        )}
                                        onClick={() => handleToggleCourse(course.id)}
                                    >
                                        <div className={cn(
                                            "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                        )}>
                                            {isSelected && <Check className="h-3.5 w-3.5" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{course.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{course.difficulty}</span>
                                                {course.published && <span className="text-green-600">• Published</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {filteredCourses.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No courses found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

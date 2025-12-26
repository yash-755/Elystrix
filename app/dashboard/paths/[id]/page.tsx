"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getLearningPathById, getUserLearningPathProgress, markNodeAsComplete, enrollUserInPath } from "@/app/actions/learning-paths"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CheckCircle, PlayCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/app/actions/user"

export default function PathDetailsPage() {
    const params = useParams()
    const { user } = useAuth()
    const [path, setPath] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedNode, setSelectedNode] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([])
    const [completing, setCompleting] = useState(false)

    // Enrollment State
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [enrolling, setEnrolling] = useState(false)

    useEffect(() => {
        async function load() {
            setLoading(true)
            const [pathData, role] = await Promise.all([
                getLearningPathById(params.id as string),
                user?.uid ? getUserRole(user.uid) : Promise.resolve("student")
            ])

            // Fetch progress if user exists
            if (user?.uid && pathData) {
                const progressData = await getUserLearningPathProgress(user.uid, pathData.id)
                if (progressData) {
                    setIsEnrolled(true)
                    if (progressData.completedNodeIds) {
                        setCompletedNodeIds(progressData.completedNodeIds)
                    }
                }
            }

            setPath(pathData)
            setIsAdmin(role === "admin")
            setLoading(false)
        }
        load()
    }, [params.id, user])

    const handleEnroll = async () => {
        if (!user?.uid || !path) return
        setEnrolling(true)
        try {
            const res = await enrollUserInPath(user.uid, path.id)
            if (res.success) {
                toast.success("Enrolled successfully!")
                setIsEnrolled(true)
            } else {
                toast.error(res.error || "Failed to enroll")
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setEnrolling(false)
        }
    }

    const handleMarkComplete = async () => {
        if (!selectedNode || !user?.uid || !path) return
        setCompleting(true)
        try {
            const res = await markNodeAsComplete(user.uid, path.id, selectedNode.id)
            if (res.success) {
                toast.success("Module Completed!")
                setCompletedNodeIds(prev => [...prev, selectedNode.id])
                // Close sheet or keep open? Keep open to show state change.
            } else {
                toast.error(res.error || "Failed to mark complete")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred")
        } finally {
            setCompleting(false)
        }
    }

    const isNodeCompleted = (nodeId: string) => completedNodeIds.includes(nodeId)

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>

    // Allow access if published OR if user is admin
    if (!path || (!path.published && !isAdmin)) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold">Path Not Available</h2>
            <p className="text-muted-foreground">The learning path you are looking for does not exist or has been removed.</p>
            <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-muted/30 border-b py-12 md:py-20">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div className="flex-1 space-y-4">
                            <Badge className="mb-2" variant="outline">{path.certificateType === "PREMIUM" ? "Premium Certificate" :
                                path.certificateType === "CAREER" ? "Career Certificate" : "Basic Certificate"}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{path.title}</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">{path.description}</p>
                        </div>

                        <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                            {isEnrolled ? (
                                <Button size="lg" className="w-full text-lg" variant="secondary" disabled>
                                    <CheckCircle className="mr-2 h-5 w-5" /> Enrolled
                                </Button>
                            ) : (
                                <Button size="lg" className="w-full text-lg shadow-lg" onClick={handleEnroll} disabled={enrolling}>
                                    {enrolling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Enroll in Path"}
                                </Button>
                            )}
                            <p className="text-xs text-center text-muted-foreground">
                                {isEnrolled ? "Track your progress below" : "Start your journey today"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Container */}
            <div className="container max-w-3xl mx-auto px-4 mt-16 relative">

                {/* Central Spine */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden md:block" />

                <div className="space-y-12 relative">
                    {path.nodes.map((node: any, idx: number) => {
                        const isLeft = idx % 2 === 0
                        const isCompleted = isNodeCompleted(node.id)

                        return (
                            <div key={node.id} className={cn(
                                "relative flex items-center md:justify-between flex-col md:flex-row gap-8",
                                isLeft ? "md:flex-row" : "md:flex-row-reverse"
                            )}>

                                {/* Node Card */}
                                <div
                                    className={cn(
                                        "w-full md:w-[45%] relative group cursor-pointer transition-transform hover:-translate-y-1",
                                    )}
                                    onClick={() => setSelectedNode(node)}
                                >
                                    {/* Connector Line (Desktop) */}
                                    <div className={cn(
                                        "hidden md:block absolute top-1/2 h-0.5 bg-border w-12",
                                        isLeft ? "-right-12" : "-left-12"
                                    )} />

                                    {/* Connector Dot (Desktop) */}
                                    <div className={cn(
                                        "hidden md:block absolute top-1/2 w-4 h-4 rounded-full border-4 border-background z-10 flex items-center justify-center",
                                        isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-primary border-background",
                                        isLeft ? "-right-[56px] translate-x-1/2" : "-left-[56px] -translate-x-1/2"
                                    )}>
                                        {isCompleted && <CheckCircle className="h-3 w-3" />}
                                    </div>

                                    <div className={cn(
                                        "p-6 rounded-xl border-2 shadow-sm transition-all relative overflow-hidden",
                                        isCompleted
                                            ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                                            : node.type === "core"
                                                ? "bg-[#d4af37]/5 border-[#d4af37]/20 hover:border-[#d4af37]"
                                                : "bg-card border-border hover:border-primary"
                                    )}>
                                        {/* Status Icon Placeholder */}
                                        <div className="absolute top-4 right-4 text-muted-foreground opacity-20">
                                            <span className="text-4xl font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                                        </div>

                                        <div className="mb-2">
                                            <Badge variant={node.type === "core" ? "default" : "secondary"} className={
                                                node.type === "core" ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/80" : ""
                                            }>
                                                {node.type}
                                            </Badge>
                                            {isCompleted && <Badge variant="outline" className="ml-2 border-green-500 text-green-600 bg-green-50">Completed</Badge>}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{node.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for flex alignment */}
                                <div className="hidden md:block w-[45%]" />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Side Panel for Node Details */}
            <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
                <SheetContent className="sm:max-w-md overflow-y-auto">
                    {selectedNode && (
                        <>
                            <SheetHeader className="mb-6">
                                <Badge className="w-fit mb-2">{selectedNode.difficulty}</Badge>
                                <SheetTitle className="text-2xl">{selectedNode.title}</SheetTitle>
                                <SheetDescription className="text-base mt-2">
                                    {selectedNode.description}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <PlayCircle className="h-5 w-5 text-primary" />
                                        Included Courses
                                    </h4>
                                    {selectedNode.courses.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No courses linked to this module yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedNode.courses.map((nc: any) => (
                                                <Link href={`/dashboard/courses/${nc.course.id}`} key={nc.course.id} className="block group/course">
                                                    <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3 hover:bg-secondary/50 transition-colors">
                                                        {/* Thumbnail */}
                                                        {nc.course.thumbnailUrl ? (
                                                            <img src={nc.course.thumbnailUrl} alt={nc.course.title} className="h-12 w-20 object-cover rounded shrink-0" />
                                                        ) : (
                                                            <div className="h-12 w-20 bg-muted rounded shrink-0 flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate group-hover/course:text-primary">{nc.course.title}</p>
                                                            <p className="text-xs text-muted-foreground">{nc.course.level || "All Levels"}</p>
                                                        </div>
                                                        <Button size="sm" variant="ghost">Start</Button>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                    <h4 className="font-semibold mb-2">Learning Objectives</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        <li>Master core concepts of {selectedNode.title}</li>
                                        <li>Apply knowledge in real-world scenarios</li>
                                        <li>Pass the assessment to complete this module</li>
                                    </ul>
                                </div>
                            </div>

                            <SheetFooter className="mt-8">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleMarkComplete}
                                    disabled={completing || isNodeCompleted(selectedNode.id)}
                                >
                                    {isNodeCompleted(selectedNode.id) ? (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Completed
                                        </>
                                    ) : (
                                        completing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Mark as Complete"
                                    )}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

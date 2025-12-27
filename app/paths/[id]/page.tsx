import { getLearningPathBySlug, enrollUserInPath } from "@/app/actions/learning-paths"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EnrollButton } from "@/components/enroll-button"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function PublicPathPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let path = await getLearningPathBySlug(id)

    if (!path) {
        // Fallback: Try fetching by ID
        try {
            const { getLearningPathById } = await import("@/app/actions/learning-paths")
            path = await getLearningPathById(id)
        } catch (error) {
            path = null
        }
    }

    if (!path) {
        notFound()
    }

    // Note: Enrollment status is now checked client-side in EnrollButton component
    // which can access the useAuth hook


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pb-20">
                {/* Header */}
                <div className="bg-muted/30 border-b py-16">
                    <div className="container max-w-4xl mx-auto px-4 text-center">
                        <Badge className="mb-4">{path.certificateType} Certificate</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{path.title}</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{path.description}</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <EnrollButton pathId={path.id} />
                        </div>
                    </div>
                </div>

                {/* Roadmap Preview */}
                <div className="container max-w-3xl mx-auto px-4 mt-16 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold">Curriculum Roadmap</h2>
                        <p className="text-muted-foreground">What you will learn in this path</p>
                    </div>

                    {/* Central Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden md:block" />

                    <div className="space-y-12 relative">
                        {path.nodes.map((node: any, idx: number) => {
                            const isLeft = idx % 2 === 0
                            return (
                                <div
                                    key={node.id}
                                    className={cn(
                                        "relative flex items-center md:justify-between flex-col md:flex-row gap-8",
                                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                                    )}
                                >
                                    {/* Node Card */}
                                    <div className={cn("w-full md:w-[45%] relative group")}>
                                        {/* Connector Line (Desktop) */}
                                        <div className={cn("hidden md:block absolute top-1/2 h-0.5 bg-border w-12", isLeft ? "-right-12" : "-left-12")} />

                                        {/* Connector Dot (Desktop) */}
                                        <div
                                            className={cn(
                                                "hidden md:block absolute top-1/2 w-4 h-4 rounded-full border-4 border-background bg-muted z-10",
                                                isLeft ? "-right-[56px] translate-x-1/2" : "-left-[56px] -translate-x-1/2"
                                            )}
                                        />

                                        <div className={cn("p-6 rounded-xl border transition-all relative overflow-hidden bg-card border-border")}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <Badge variant="outline">{node.type}</Badge>
                                                <span className="text-xs text-muted-foreground font-mono">{(idx + 1).toString().padStart(2, "0")}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{node.description}</p>

                                            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{node.courses.length} Courses</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spacer for flex alignment */}
                                    <div className="hidden md:block w-[45%]" />
                                </div>
                            )
                        })}

                        {path.nodes.length === 0 && (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                                <p className="text-muted-foreground">Curriculum is being updated.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import {
    X, ChevronDown, ChevronRight, Lock, CheckCircle2, FileText, Circle, BookOpen
} from "lucide-react"
import { CourseData, Lesson } from "@/types/course-viewer"

interface CourseSidebarProps {
    courseData: CourseData
    isMobileMenuOpen: boolean
    setIsMobileMenuOpen: (open: boolean) => void
    expandedModules: string[]
    toggleModule: (moduleId: string) => void
    onLessonSelect: (lessonId: string) => void
}

// Dashboard navigation removed - course player shows only course content

export function CourseSidebar({
    courseData,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    expandedModules,
    toggleModule,
    onLessonSelect
}: CourseSidebarProps) {

    const getLessonIcon = (lesson: Partial<Lesson>) => {
        if (lesson.locked) return <Lock className="h-4 w-4 text-muted-foreground" />
        if (lesson.completed) return <CheckCircle2 className="h-4 w-4 text-green-500" />
        if (lesson.type === "quiz") return <FileText className="h-4 w-4 text-muted-foreground" />
        if (lesson.type === "exercise") return <BookOpen className="h-4 w-4 text-muted-foreground" />
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }

    return (
        <aside className={cn(
            "flex-col w-80 border-r border-border bg-card overflow-y-auto transition-transform duration-300 absolute inset-y-0 left-0 z-20 md:relative md:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* 1. Header/Logo */}
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                <Link href="/" className="flex items-center gap-2">
                    <Logo size="sm" />
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden text-muted-foreground"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Course Title */}
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">{courseData.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">by {courseData.instructor}</p>
            </div>



            {/* 4. Lesson Curriculum List */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Curriculum
                </div>
                <div className="space-y-1 p-2">
                    {courseData.modules.map((module) => (
                        <div key={module.id} className="border border-border rounded-lg overflow-hidden mb-2 bg-background/50">
                            <button
                                onClick={() => toggleModule(module.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 text-left hover:bg-accent/50 transition-colors",
                                    module.completed && "bg-primary/5",
                                )}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {expandedModules.includes(module.id) ? (
                                        <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="font-medium text-sm truncate">{module.title}</span>
                                </div>
                            </button>

                            {expandedModules.includes(module.id) && (
                                <div className="border-t border-border bg-background">
                                    {/* Map Lessons */}
                                    {module.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 pl-8 text-left hover:bg-accent transition-colors border-l-2 border-transparent",
                                                lesson.current ? "bg-primary/5 border-primary" : "",
                                                lesson.locked && "opacity-50 cursor-not-allowed",
                                            )}
                                            disabled={lesson.locked}
                                            onClick={() => onLessonSelect(lesson.id)}
                                        >
                                            {getLessonIcon(lesson)}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={cn(
                                                        "text-sm truncate",
                                                        lesson.current && "text-primary font-medium",
                                                        lesson.completed && "text-muted-foreground",
                                                    )}
                                                >
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-muted-foreground">{lesson.duration}</span>
                                                    {lesson.type === 'video' && <span className="text-[10px] bg-secondary px-1 rounded text-secondary-foreground">Video</span>}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground text-center block">© 2024 Elystrix</span>
            </div>
        </aside>
    )
}

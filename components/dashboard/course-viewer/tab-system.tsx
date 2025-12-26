"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock } from "lucide-react"
import { CourseData } from "@/types/course-viewer"

interface CourseTabsProps {
    courseData: CourseData
    activeTab: string
    setActiveTab: (tab: string) => void
    newNote: string
    setNewNote: (note: string) => void
}

export function CourseTabs({
    courseData,
    activeTab,
    setActiveTab,
}: CourseTabsProps) {
    // Check if current lesson is completed (determines quiz lock state)
    const currentLessonCompleted = courseData.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === courseData.currentLesson.id)?.completed || false

    const isQuizLocked = !currentLessonCompleted

    // If quiz is locked and user tries to access it, switch to overview
    useEffect(() => {
        if (isQuizLocked && activeTab === "quiz") {
            setActiveTab("overview")
        }
    }, [isQuizLocked, activeTab, setActiveTab])

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 space-x-6">
                {/* Quiz Tab - First, locked until lesson completion */}
                <TabsTrigger
                    value="quiz"
                    disabled={isQuizLocked}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 capitalize bg-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isQuizLocked && <Lock className="h-3 w-3" />}
                    Quiz
                </TabsTrigger>

                {/* Overview Tab - Always accessible */}
                <TabsTrigger
                    value="overview"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 capitalize bg-transparent"
                >
                    Overview
                </TabsTrigger>
            </TabsList>

            <div className="mt-6">
                {/* Quiz Tab Content */}
                <TabsContent value="quiz" className="m-0">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {isQuizLocked ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-card/30">
                                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Quiz Locked</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Complete at least 70% of this lesson to unlock the quiz.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-card/30">
                                <h3 className="text-lg font-semibold mb-2">Quiz Available</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Quiz functionality will be integrated here.
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Overview Tab Content */}
                <TabsContent value="overview" className="m-0">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h3>About this lesson</h3>
                        {courseData.currentLesson.description ? (
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {courseData.currentLesson.description}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">
                                No overview provided for this lesson.
                            </p>
                        )}
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    )
}

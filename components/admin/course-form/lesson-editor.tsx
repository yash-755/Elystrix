"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Edit, Video, BookOpen, FileQuestion } from "lucide-react"
import { updateLesson } from "@/actions/lessons"
import { toast } from "sonner"
import { QuizSettings } from "./quiz-settings"

interface LessonEditorProps {
    lesson: any
}

export function LessonEditor({ lesson }: LessonEditorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState(lesson.title)
    const [description, setDescription] = useState(lesson.description || "")
    const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "")
    const [published, setPublished] = useState(lesson.published)

    // Tabs inside the Sheet
    const [activeTab, setActiveTab] = useState("content") // content | quiz

    const handleSave = async () => {
        const result = await updateLesson(lesson.id, {
            title,
            description,
            videoUrl,
            published
        })

        if (result.success) {
            toast.success("Lesson updated")
            setIsOpen(false)
        } else {
            toast.error("Failed to update lesson")
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Edit Lesson</SheetTitle>
                    <SheetDescription>Make changes to lesson content and settings</SheetDescription>
                </SheetHeader>

                <div className="flex items-center gap-2 mt-6 border-b pb-2">
                    <Button
                        variant={activeTab === "content" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("content")}
                    >
                        <Video className="h-4 w-4 mr-2" />
                        Content
                    </Button>
                    <Button
                        variant={activeTab === "quiz" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("quiz")}
                    >
                        <FileQuestion className="h-4 w-4 mr-2" />
                        Quiz ({lesson.quiz ? "Active" : "None"})
                    </Button>
                </div>

                {activeTab === "content" && (
                    <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
                            <p className="text-xs text-muted-foreground">Supported: YouTube, Vimeo, MP4</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/10">
                            <div>
                                <Label>Published</Label>
                                <p className="text-xs text-muted-foreground">Visible to enrolled students</p>
                            </div>
                            <Switch checked={published} onCheckedChange={setPublished} />
                        </div>

                        <Button onClick={handleSave} className="w-full">Save Changes</Button>
                    </div>
                )}

                {activeTab === "quiz" && (
                    <div className="mt-6">
                        <QuizSettings
                            courseId={lesson.courseId}
                            lessonId={lesson.id}
                            initialQuiz={lesson.quiz}
                            type="LESSON_QUIZ"
                        />
                    </div>
                )}

            </SheetContent>
        </Sheet>
    )
}

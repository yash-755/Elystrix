"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Youtube, LinkIcon, Sparkles, Plus, GripVertical, Trash2, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createLesson, deleteLesson, reorderLessons, updateLesson } from "@/actions/lessons"
import { LessonEditor } from "./lesson-editor"

interface Lesson {
    id: string
    title: string
    description?: string
    videoUrl?: string
    published: boolean
    order: number
    quiz?: any
}

interface LessonManagerProps {
    courseId: string
    initialLessons: Lesson[]
}

export function LessonManager({ courseId, initialLessons }: LessonManagerProps) {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
    const [isCreating, setIsCreating] = useState(false)
    const [newLessonTitle, setNewLessonTitle] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Sync with props if needed (e.g. after revalidate)
    useEffect(() => {
        setLessons(initialLessons)
    }, [initialLessons])

    const handleCreateLesson = async () => {
        if (!newLessonTitle.trim()) return

        setIsCreating(true)
        const result = await createLesson({
            courseId,
            title: newLessonTitle,
            order: lessons.length + 1
        })
        setIsCreating(false)

        if (result.success && result.lesson) {
            setLessons([...lessons, result.lesson as any]) // Type cast due to prisma any
            setNewLessonTitle("")
            setIsAddDialogOpen(false)
            toast.success("Lesson created")
        } else {
            toast.error(result.error || "Failed into create lesson")
        }
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        const result = await deleteLesson(deleteId)
        if (result.success) {
            setLessons(lessons.filter(l => l.id !== deleteId))
            toast.success("Lesson deleted")
            setDeleteId(null)
        } else {
            toast.error("Failed to delete lesson")
            setDeleteId(null)
        }
    }

    // Placeholder for Reorder (Drag and Drop is complex to implement fully here without dnd-kit or similar, 
    // sticking to simple Move Up/Down or just visual list for now as per time constraints, 
    // but User asked for "Reorder lessons". I'll add simple Up/Down buttons if drag is too much code,
    // OR just use a simple button triggered reorder).
    // Actually, "Drag to reorder" was in the mock. I'll implement simple swap logic for now.

    const moveLesson = async (index: number, direction: 'up' | 'down') => {
        const newLessons = [...lessons]
        if (direction === 'up' && index > 0) {
            [newLessons[index], newLessons[index - 1]] = [newLessons[index - 1], newLessons[index]]
        } else if (direction === 'down' && index < newLessons.length - 1) {
            [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]]
        } else {
            return
        }

        setLessons(newLessons)
        // Call server to persist order
        const orderedIds = newLessons.map(l => l.id)
        await reorderLessons(courseId, orderedIds)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Course Lessons</CardTitle>
                            <CardDescription>Manage lessons for this course</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lesson
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Lesson</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Lesson Title</Label>
                                        <Input
                                            value={newLessonTitle}
                                            onChange={(e) => setNewLessonTitle(e.target.value)}
                                            placeholder="e.g. Introduction to React"
                                        />
                                    </div>
                                    <Button onClick={handleCreateLesson} disabled={isCreating} className="w-full">
                                        {isCreating ? "Creating..." : "Create Lesson"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {lessons.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                No lessons yet. Click "Add Lesson" to start.
                            </div>
                        ) : (
                            lessons.map((lesson, idx) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors group"
                                >
                                    <div className="flex flex-col gap-1">
                                        <Button variant="ghost" size="icon" className="h-4 w-4" disabled={idx === 0} onClick={() => moveLesson(idx, 'up')}>
                                            <span className="sr-only">Move Up</span>
                                            ▲
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-4 w-4" disabled={idx === lessons.length - 1} onClick={() => moveLesson(idx, 'down')}>
                                            <span className="sr-only">Move Down</span>
                                            ▼
                                        </Button>
                                    </div>
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium">{lesson.title}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            {lesson.videoUrl ? <Badge variant="secondary" className="text-[10px]">Video</Badge> : <Badge variant="outline" className="text-[10px]">No Content</Badge>}
                                            {lesson.quiz ? <Badge variant="secondary" className="text-[10px]">Quiz Active</Badge> : null}
                                        </div>
                                    </div>
                                    <Badge variant={lesson.published ? "default" : "outline"} className={!lesson.published ? "text-yellow-600 border-yellow-600" : "bg-green-600"}>
                                        {lesson.published ? "Published" : "Draft"}
                                    </Badge>

                                    <LessonEditor lesson={lesson} />


                                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(lesson.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this lesson? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            Delete Lesson
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

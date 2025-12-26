"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, CheckCircle, AlertCircle, Save } from "lucide-react"
import { upsertQuiz, deleteQuiz } from "@/actions/quizzes"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuizProps {
    courseId: string
    lessonId?: string
    initialQuiz?: any
    type: "LESSON_QUIZ" | "FINAL_QUIZ"
}

type Question = {
    id: string
    question: string
    options: string[]
    correctAnswer: number
}

// Simple Quiz Builder
export function QuizSettings({ courseId, lessonId, initialQuiz, type }: QuizProps) {
    const [quiz, setQuiz] = useState<any>(initialQuiz)
    const [isEditing, setIsEditing] = useState(!initialQuiz)

    // Form State
    const [questions, setQuestions] = useState<Question[]>(initialQuiz?.questions || [])
    const [quizTitle, setQuizTitle] = useState(initialQuiz?.title || (type === "LESSON_QUIZ" ? "Lesson Quiz" : "Final Exam"))
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const maxQuestions = type === "LESSON_QUIZ" ? 10 : 30

    // Add Question
    const addQuestion = () => {
        if (questions.length >= maxQuestions) {
            toast.error(`Maximum ${maxQuestions} questions allowed for ${type === "LESSON_QUIZ" ? "Lesson Quizzes" : "Final Exams"}`)
            return
        }
        setQuestions([
            ...questions,
            { id: Date.now().toString(), question: "", options: ["", "", "", ""], correctAnswer: 0 }
        ])
    }

    const updateQuestion = (idx: number, field: string, value: any) => {
        const newQs = [...questions]
        newQs[idx] = { ...newQs[idx], [field]: value }
        setQuestions(newQs)
    }

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        const newQs = [...questions]
        newQs[qIdx].options[oIdx] = value
        setQuestions(newQs)
    }

    const removeQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx))
    }

    const handleSaveQuiz = async () => {
        // Validation
        if (questions.length === 0) {
            toast.error("Add at least one question")
            return
        }
        if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
            toast.error("Fill in all questions and options")
            return
        }

        const result = await upsertQuiz({
            courseId,
            lessonId,
            questions,
            title: quizTitle,
            type
        })

        if (result.success && result.quiz) {
            setQuiz(result.quiz)
            setIsEditing(false)
            toast.success("Quiz saved successfully")
        } else {
            toast.error(result.error || "Failed to save quiz")
        }
    }

    const handleDeleteQuiz = async () => {
        if (quiz?.id) {
            await deleteQuiz(quiz.id)
            setQuiz(null)
            setQuestions([])
            setIsEditing(true)
            setShowDeleteConfirm(false)
            toast.success("Quiz deleted")
        }
    }

    if (!isEditing && quiz) {
        return (
            <>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{quiz.title}</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Quiz</Button>
                                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{quiz.questions.length} Questions Configured.</p>
                    </CardContent>
                </Card>
                <DeleteQuizAlert
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={handleDeleteQuiz}
                />
            </>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{type === "LESSON_QUIZ" ? "Lesson Quiz" : "Final Course Exam"}</CardTitle>
                <CardDescription>
                    {type === "LESSON_QUIZ"
                        ? "Reinforce learning with a short quiz (Max 10 questions). Does not award certificate."
                        : "Comprehensive exam required for certification (Max 30 questions)."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Quiz Title</Label>
                    <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
                </div>

                <div className="space-y-4">
                    {questions.map((q, qIdx) => (
                        <Card key={q.id} className="p-4 bg-muted/20">
                            <div className="flex justify-between mb-2">
                                <Label className="flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-xs">{qIdx + 1}</span>
                                    Question Text
                                </Label>
                                <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIdx)} className="h-6 w-6">
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <Textarea
                                className="mb-4"
                                placeholder="Enter question..."
                                value={q.question}
                                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                            />

                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Options (Select correct answer)</Label>
                                <RadioGroup
                                    value={q.correctAnswer.toString()}
                                    onValueChange={(val) => updateQuestion(qIdx, "correctAnswer", parseInt(val))}
                                    className="space-y-2"
                                >
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-2">
                                            <RadioGroupItem value={oIdx.toString()} id={`q${q.id}-opt${oIdx}`} />
                                            <Input
                                                value={opt}
                                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                placeholder={`Option ${oIdx + 1}`}
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </Card>
                    ))}
                </div>

                <Button variant="outline" onClick={addQuestion} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    {quiz && <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
                    <Button onClick={handleSaveQuiz} disabled={questions.length === 0}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Quiz
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function DeleteQuizAlert({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this quiz? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
                        Delete Quiz
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

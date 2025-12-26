"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Flag, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuizData, QuizState } from "@/types/quiz-player"

interface QuizScreenProps {
    quizData: QuizData
    questonIndex: number
    answers: Record<number, number | number[]>
    flagged: number[]
    timeRemaining: number
    setQuizState: (state: QuizState) => void
    setCurrentQuestion: (index: number | ((prev: number) => number)) => void
    handleSingleAnswer: (value: string) => void
    handleMultipleAnswer: (optionIndex: number, checked: boolean) => void
    toggleFlag: () => void
}

export function QuizScreen({
    quizData,
    questonIndex: currentQuestion,
    answers,
    flagged,
    timeRemaining,
    setQuizState,
    setCurrentQuestion,
    handleSingleAnswer,
    handleMultipleAnswer,
    toggleFlag
}: QuizScreenProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const question = quizData.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quizData.totalQuestions) * 100

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-semibold">{quizData.title}</h1>
                    <p className="text-sm text-muted-foreground">{quizData.courseTitle}</p>
                </div>
                <div
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                        timeRemaining < 60 ? "bg-destructive/10 text-destructive" : "bg-secondary",
                    )}
                >
                    <Clock className="h-4 w-4" />
                    <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>
                        Question {currentQuestion + 1} of {quizData.totalQuestions}
                    </span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            {question.type === "multiple" && (
                                <Badge variant="outline" className="mb-2">
                                    Multiple Answers
                                </Badge>
                            )}
                            <h2 className="text-lg font-medium">{question.question}</h2>
                        </div>
                        <Button
                            variant={flagged.includes(currentQuestion) ? "default" : "outline"}
                            size="icon"
                            onClick={toggleFlag}
                        >
                            <Flag className="h-4 w-4" />
                        </Button>
                    </div>

                    {question.type === "single" ? (
                        <RadioGroup
                            value={answers[question.id]?.toString() || ""}
                            onValueChange={handleSingleAnswer}
                            className="space-y-3"
                        >
                            {question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer",
                                        answers[question.id] === idx && "border-primary bg-primary/5",
                                    )}
                                >
                                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    ) : (
                        <div className="space-y-3">
                            {question.options.map((option, idx) => {
                                const isChecked = ((answers[question.id] as number[]) || []).includes(idx)
                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer",
                                            isChecked && "border-primary bg-primary/5",
                                        )}
                                    >
                                        <Checkbox
                                            id={`option-${idx}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => handleMultipleAnswer(idx, checked as boolean)}
                                        />
                                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                                            {option}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">Question Navigator</p>
                    <div className="flex flex-wrap gap-2">
                        {quizData.questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                    currentQuestion === idx && "bg-primary text-primary-foreground",
                                    currentQuestion !== idx && answers[quizData.questions[idx].id] !== undefined && "bg-secondary",
                                    currentQuestion !== idx &&
                                    answers[quizData.questions[idx].id] === undefined &&
                                    "bg-card border border-border",
                                    flagged.includes(idx) && "ring-2 ring-orange-500",
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                {currentQuestion === quizData.totalQuestions - 1 ? (
                    <Button onClick={() => setQuizState("results")}>Submit Quiz</Button>
                ) : (
                    <Button onClick={() => setCurrentQuestion((prev) => prev + 1)}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                )}
            </div>
        </div>
    )
}

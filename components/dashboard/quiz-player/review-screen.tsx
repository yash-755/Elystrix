"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuizData, QuizState } from "@/types/quiz-player"

interface ReviewScreenProps {
    quizData: QuizData
    currentQuestion: number
    setCurrentQuestion: (index: number) => void
    answers: Record<number, number | number[]>
    setQuizState: (state: QuizState) => void
}

export function ReviewScreen({
    quizData,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setQuizState
}: ReviewScreenProps) {
    const reviewQuestion = quizData.questions[currentQuestion]
    const userAnswer = answers[reviewQuestion.id]
    const isCorrect =
        reviewQuestion.type === "single"
            ? userAnswer === reviewQuestion.correctAnswer
            : reviewQuestion.type === "multiple" &&
            JSON.stringify([...(userAnswer as number[])].sort()) ===
            JSON.stringify([...(reviewQuestion.correctAnswers || [])].sort())

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setQuizState("results")}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Results
                </Button>
                <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quizData.totalQuestions}
                </span>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-6">
                        {isCorrect ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                        ) : (
                            <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                        )}
                        <div>
                            <Badge variant={isCorrect ? "default" : "destructive"} className="mb-2">
                                {isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                            <h2 className="text-lg font-medium">{reviewQuestion.question}</h2>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {reviewQuestion.options.map((option, idx) => {
                            const isUserAnswer =
                                reviewQuestion.type === "single" ? userAnswer === idx : (userAnswer as number[])?.includes(idx)
                            const isCorrectOption =
                                reviewQuestion.type === "single"
                                    ? reviewQuestion.correctAnswer === idx
                                    : reviewQuestion.correctAnswers?.includes(idx)

                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "p-3 rounded-lg border",
                                        isCorrectOption && "border-green-500 bg-green-500/10",
                                        isUserAnswer && !isCorrectOption && "border-destructive bg-destructive/10",
                                        !isUserAnswer && !isCorrectOption && "border-border",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {isCorrectOption && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                        {isUserAnswer && !isCorrectOption && <XCircle className="h-4 w-4 text-destructive" />}
                                        <span>{option}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 rounded-lg bg-secondary">
                        <h3 className="font-medium mb-1">Explanation</h3>
                        <p className="text-sm text-muted-foreground">{reviewQuestion.explanation}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    disabled={currentQuestion === quizData.totalQuestions - 1}
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

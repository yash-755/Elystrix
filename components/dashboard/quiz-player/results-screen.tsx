"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, XCircle, Award, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuizData, QuizState } from "@/types/quiz-player"

interface ResultsScreenProps {
    quizData: QuizData
    score: number
    passed: boolean
    totalAnswered: number
    timeRemaining: number
    quizState: QuizState
    setQuizState: (state: QuizState) => void
    generatedCertId: string | null
    setAnswers: (answers: Record<number, number | number[]>) => void
    setFlagged: (flagged: number[]) => void
    setCurrentQuestion: (index: number) => void
    setTimeRemaining: (time: number) => void
}

export function ResultsScreen({
    quizData,
    score,
    passed,
    totalAnswered,
    timeRemaining,
    setQuizState,
    generatedCertId,
    setAnswers,
    setFlagged,
    setCurrentQuestion,
    setTimeRemaining
}: ResultsScreenProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardContent className="pt-8 text-center">
                    <div
                        className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                            passed ? "bg-primary/20 gold-glow-sm" : "bg-destructive/20",
                        )}
                    >
                        {passed ? (
                            <Trophy className="h-12 w-12 text-primary" />
                        ) : (
                            <XCircle className="h-12 w-12 text-destructive" />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mb-2">{passed ? "Congratulations!" : "Keep Practicing!"}</h1>
                    <p className="text-muted-foreground mb-6">
                        {passed
                            ? "You've passed the quiz and earned your certificate!"
                            : `You need ${quizData.passingScore}% to pass. Review the material and try again.`}
                    </p>

                    <div className="text-6xl font-bold mb-2">
                        <span className={passed ? "text-primary" : "text-destructive"}>{score}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-8">
                        {totalAnswered} of {quizData.totalQuestions} questions answered correctly
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-lg bg-secondary text-center">
                            <p className="text-sm text-muted-foreground">Time Taken</p>
                            <p className="text-xl font-semibold">{formatTime(quizData.timeLimit * 60 - timeRemaining)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary text-center">
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="text-xl font-semibold">{score}%</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setQuizState("review")}>
                            Review Answers
                        </Button>
                        {passed ? (
                            <div className="flex-1">
                                {generatedCertId ? (
                                    <Link href={`/verify/${generatedCertId}`} className="flex-1">
                                        <Button className="w-full">
                                            <Award className="h-4 w-4 mr-2" />
                                            View Certificate
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button className="w-full" disabled>
                                        <Award className="h-4 w-4 mr-2 animate-pulse" />
                                        Generating Certificate...
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    setQuizState("intro")
                                    setAnswers({})
                                    setFlagged([])
                                    setCurrentQuestion(0)
                                    setTimeRemaining(quizData.timeLimit * 60)
                                }}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Retry Quiz
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

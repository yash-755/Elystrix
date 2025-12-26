"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, AlertCircle } from "lucide-react"
import { QuizData, QuizState } from "@/types/quiz-player"

interface IntroScreenProps {
    quizData: QuizData
    setQuizState: (state: QuizState) => void
}

export function IntroScreen({ quizData, setQuizState }: IntroScreenProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/dashboard/quizzes"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Quizzes
            </Link>

            <Card>
                <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                    <p className="text-muted-foreground">{quizData.courseTitle}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-2xl font-bold">{quizData.totalQuestions}</p>
                            <p className="text-sm text-muted-foreground">Questions</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-2xl font-bold">{quizData.timeLimit}m</p>
                            <p className="text-sm text-muted-foreground">Time Limit</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-2xl font-bold">{quizData.passingScore}%</p>
                            <p className="text-sm text-muted-foreground">To Pass</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            Before You Start
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• You can flag questions to review later</li>
                            <li>• Some questions may have multiple correct answers</li>
                            <li>• Your progress is saved if you lose connection</li>
                            <li>• You need {quizData.passingScore}% to earn your certificate</li>
                        </ul>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => setQuizState("in-progress")}>
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

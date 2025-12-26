export interface QuizQuestion {
    id: number
    type: string
    question: string
    options: string[]
    correctAnswer?: number
    correctAnswers?: number[]
    explanation: string
}

export interface QuizData {
    id: string
    title: string
    courseTitle: string
    totalQuestions: number
    timeLimit: number
    passingScore: number
    questions: QuizQuestion[]
}

export type QuizState = "intro" | "in-progress" | "review" | "results"

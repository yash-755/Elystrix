import { redirect } from "next/navigation"

interface QuizPageProps {
    params: {
        courseId: string
    }
}

export default function QuizPage({ params }: QuizPageProps) {
    redirect(`/admin/courses/${params.courseId}/builder?tab=quizzes`)
}

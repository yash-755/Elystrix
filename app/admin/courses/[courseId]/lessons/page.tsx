import { redirect } from "next/navigation"

interface LessonsPageProps {
    params: {
        courseId: string
    }
}

export default function LessonsPage({ params }: LessonsPageProps) {
    redirect(`/admin/courses/${params.courseId}/builder?tab=lessons`)
}

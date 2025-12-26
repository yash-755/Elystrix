
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface BuilderPageProps {
    params: {
        courseId: string
    }
}

export default async function BuilderPage({ params }: BuilderPageProps) {
    // Legacy route protection: redirect to main course page
    redirect(`/admin/courses/${params.courseId}?tab=lessons`);
}

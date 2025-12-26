"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BasicDetails, Category } from "@/components/admin/course-form/basic-details"
import { createCourse } from "@/actions/courses"
import { useRouter } from "next/navigation"

interface NewCourseClientProps {
    categories: Category[]
}

export function NewCourseClient({ categories }: NewCourseClientProps) {
    const router = useRouter()

    const [instructorName, setInstructorName] = useState("")
    const [instructorChannelName, setInstructorChannelName] = useState("")
    const [certificateType, setCertificateType] = useState("BASIC")
    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    // Categorization
    const [categoryId, setCategoryId] = useState("")
    const [difficulty, setDifficulty] = useState("Beginner")
    const [tags, setTags] = useState<string[]>([])

    const handleCreate = async () => {
        // Validation
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category.");
            return;
        }

        if (!instructorName.trim()) {
            toast.error("Instructor Name is required.");
            return;
        }

        if (!thumbnailUrl) {
            toast.error("Course thumbnail is required.");
            return;
        }

        // if (certificateType === "CAREER") {
        //     // We could add client-side check if user is admin here if we had current user context
        //     // But server action validation is critical source of truth
        // }

        try {
            const result = await createCourse({
                title,
                description,
                thumbnail: thumbnailUrl,
                categoryId,
                difficulty,
                certificateType,
                published: false,
                instructorName,
                instructorChannelName,
                tags
            });

            if (result.success && result.courseId) {
                toast.success("Course Created! Opening editor...");
                router.refresh();
                router.push(`/admin/courses/${result.courseId}`);
            } else {
                toast.error(result.error || "Failed to create course");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Create New Course</h1>
                    <p className="text-muted-foreground">Start by entering the basic details. You can add lessons and quizzes after creation.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCreate}>
                        <Save className="h-4 w-4 mr-2" />
                        Create & Continue
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <BasicDetails
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    thumbnailUrl={thumbnailUrl}
                    setThumbnailUrl={setThumbnailUrl}

                    categories={categories}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    tags={tags}
                    setTags={setTags}

                    instructorName={instructorName}
                    setInstructorName={setInstructorName}
                    instructorChannelName={instructorChannelName}
                    setInstructorChannelName={setInstructorChannelName}

                    certificateType={certificateType}
                    setCertificateType={setCertificateType}
                />
            </div>
        </div>
    )
}

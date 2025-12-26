"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BasicDetails, Category } from "@/components/admin/course-form/basic-details"
import { LessonManager } from "@/components/admin/course-form/lesson-manager"
import { QuizSettings } from "@/components/admin/course-form/quiz-settings"
import { CourseSettings } from "@/components/admin/course-form/course-settings"
import { updateCourse } from "@/actions/courses"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface EditCourseClientProps {
    course: any
    categories: Category[]
    initialTab?: string
}

export function EditCourseClient({ course, categories, initialTab = "details" }: EditCourseClientProps) {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get("tab")
    // If query param exists, use it. Otherwise use prop.
    const [activeTab, setActiveTab] = useState(tabParam || initialTab)

    // Sync state if URL changes (optional, but good for back button)
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    // State Mapping
    const [instructorName, setInstructorName] = useState(course.instructorName || "")
    const [instructorChannelName, setInstructorChannelName] = useState(course.instructorChannelName || "")
    const [certificateType, setCertificateType] = useState(course.certificateType || "BASIC")
    const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnailUrl || "")
    const [title, setTitle] = useState(course.title)
    const [description, setDescription] = useState(course.description || "")

    const [categoryId, setCategoryId] = useState(course.categoryId || "")
    const [difficulty, setDifficulty] = useState(course.difficulty || "Beginner")
    const [tags, setTags] = useState<string[]>(course.tags || [])

    const [published, setPublished] = useState(course.published || false)

    const handleUpdate = async () => {
        // Validation
        if (!title.trim()) return toast.error("Title required");
        if (!instructorName.trim()) return toast.error("Instructor name required");

        try {
            const result = await updateCourse(course.id, {
                title,
                description,
                thumbnail: thumbnailUrl,
                categoryId,
                difficulty,
                tags,
                certificateType,
                published,
                instructorName,
                instructorChannelName
            })

            if (result.success) {
                toast.success("Course Updated Successfully");
            } else {
                toast.error(result.error || "Failed using update");
            }
        } catch (error) {
            toast.error("Error updating course");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <Badge variant={published ? "default" : "secondary"}>
                            {published ? "Published" : "Draft"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">Last updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Switch id="published-mode" checked={published} onCheckedChange={setPublished} />
                        <Label htmlFor="published-mode" className="cursor-pointer">
                            {published ? "Published" : "Draft Mode"}
                        </Label>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex gap-2">
                        {/* TODO: Add Preview Link when public page is ready */}
                        <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                        <Button onClick={handleUpdate}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="final-quiz">Result & Final Quiz</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                    <BasicDetails
                        courseId={course.id}
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
                </TabsContent>

                <TabsContent value="lessons" className="space-y-6">
                    <LessonManager courseId={course.id} initialLessons={course.lessons} />
                </TabsContent>

                <TabsContent value="final-quiz" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <QuizSettings courseId={course.id} initialQuiz={course.finalQuiz} type="FINAL_QUIZ" />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-2">Final Quiz Rules</h3>
                                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                    <li>This quiz is REQUIRED for the certificate.</li>
                                    <li>Students must pass with a score of 80% or higher.</li>
                                    <li>Maximum 30 questions allowed.</li>
                                    <li>Students can retake if they fail.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <CourseSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}


import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Award, Star, CheckCircle, Play, Users } from "lucide-react"
import { getPublicCourse } from "@/app/actions/courses"
import { notFound } from "next/navigation"

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = await getPublicCourse(id)

  if (!course) {
    notFound()
  }

  // Fallbacks for missing schema fields
  const instructor = {
    name: "Elystrix Instructor",
    avatar: "/male-developer-avatar.png", // Keep placeholder if nice
    bio: "Expert Instructor",
  }

  // Flatten lessons to modules list for UI compatibility
  // If we have no grouping, we just show one module "Course Content"
  const modules_list = course.lessons?.length > 0 ? [{
    title: "Course Content",
    duration: course.duration || "Self-paced",
    lessons: course.lessons.length
  }] : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {course.level || "Beginner"}
                  </Badge>
                  <Badge variant="outline" className="bg-transparent">
                    {course.category?.name || "General"}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{course.description || "No description available."}</p>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                  {course.rating > 0 && (
                    <span className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      {course.rating.toFixed(1)}
                    </span>
                  )}
                  {/* Students count not available in Course model, skipping */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration || "Self-paced"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons?.length || 0} lessons
                  </span>
                </div>

                {/* Instructor - hardcoded fallback for now as schema lacks it */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow">
                      <Play className="mr-2 h-5 w-5" />
                      Start Learning
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    Add to Wishlist
                  </Button>
                </div>
              </div>

              {/* Course Preview Card */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={course.thumbnailUrl || course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <button className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center gold-glow hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-6 w-6 text-[#C0C0C0]" />
                    <div>
                      <p className="font-medium text-foreground">Certificate of Completion</p>
                      <p className="text-sm text-muted-foreground">Awarded upon completion</p>
                    </div>
                  </div>
                  <div className="h-px bg-border my-4" />
                  <p className="text-sm text-muted-foreground">
                    Complete all modules to earn your verified certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">

                {/* Modules / Chapters */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {(course.lessons?.length || 0) > 0 ? (
                      <div className="divide-y divide-border">
                        {course.lessons!.map((lesson: any, index: number) => (
                          <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{lesson.title}</p>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                              )}
                            </div>
                            <Play className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No lessons available yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Course Stats */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Course Includes</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Play className="h-4 w-4 text-primary" />
                      {course.lessons?.length || 0} lessons
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Award className="h-4 w-4 text-primary" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

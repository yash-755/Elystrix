"use client"

import { useState, useEffect } from "react"
import { LayoutGrid, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCard } from "@/components/course-card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
// import { enrolledCourses } from "./data" // Removed static data
import { useAuth } from "@/components/auth-provider"
import { getUserCourses } from "@/app/actions/courses"

export default function MyCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function fetchCourses() {
      if (user?.uid) {
        setLoading(true)
        try {
          const data = await getUserCourses(user.uid, filter) // Pass filter if handled, or filter client side
          // Actually action handles basic status filter, but we can also filter client side if action returns all
          // Let's rely on client side filtering for smoother tab switch if data is small, or re-fetch.
          // For now, let's fetch ALL and filter client side to avoid loading spinners on tab switch
          const allData = await getUserCourses(user.uid)
          setCourses(allData)
        } catch (e) {
          console.error(e)
        } finally {
          setLoading(false)
        }
      } else if (!user) {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [user]) // Removed filter dependency to do client-side filtering

  const filteredCourses = courses.filter((course) => {
    if (filter === "all") return true
    return course.status === filter
  })

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">My Courses</h1>
        <p className="text-muted-foreground">Track your progress and continue learning</p>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-primary text-primary-foreground" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            className={view === "list" ? "bg-primary text-primary-foreground" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Courses */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground">No courses found.</p>
        </div>
      ) : (
        view === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
              >
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex-1 max-w-[200px]">
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                    <span className="text-sm text-primary font-medium">{course.progress}%</span>
                  </div>
                </div>
                <Button
                  className={cn(
                    course.progress === 100
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {course.progress === 100 ? "Review" : "Resume"}
                </Button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}


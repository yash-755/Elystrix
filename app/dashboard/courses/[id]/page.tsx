"use client"

import { useState, use, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Logo } from "@/components/logo"
import { Menu, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { createCertificate } from "@/lib/certificates"
import { toast } from "sonner"
import { CourseData } from "@/types/course-viewer"

import { CourseSidebar } from "@/components/dashboard/course-viewer/course-sidebar"
import { VideoPlayer } from "@/components/dashboard/course-viewer/video-player"
import { CourseTabs } from "@/components/dashboard/course-viewer/tab-system"
import { getCourseViewerData } from "@/app/actions/courses"

export default function CourseViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()

  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  const [expandedModules, setExpandedModules] = useState<string[]>(["default-module"])
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [isGeneratingCert, setIsGeneratingCert] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch Data
  useEffect(() => {
    async function loadData() {
      if (!user) return
      try {
        setLoading(true)
        const data = await getCourseViewerData(id, user.uid)
        if (data) {
          setCourseData(data)
          // Expand all modules by default or just first
          setExpandedModules(data.modules.map(m => m.id))
        } else {
          toast.error("Course not found or empty")
        }
      } catch (error) {
        console.error("Failed to load course", error)
        toast.error("Failed to load course content")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, user]) // depend on user to re-fetch on login

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleLessonSelect = (lessonId: string) => {
    setCourseData(prev => {
      if (!prev) return null

      // Find the lesson
      let selectedLesson: any = null

      const newModules = prev.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(l => {
          if (l.id === lessonId) {
            selectedLesson = l
            return { ...l, current: true }
          }
          return { ...l, current: false }
        })
      }))

      if (!selectedLesson) return prev

      return {
        ...prev,
        modules: newModules,
        currentLesson: {
          id: selectedLesson.id,
          title: selectedLesson.title,
          duration: selectedLesson.duration,
          videoId: selectedLesson.videoId,
          watchedPercentage: selectedLesson.watchedPercentage
        }
      }
    })
    // Close mobile menu on select
    setIsMobileMenuOpen(false)
  }

  const handleProgressUpdate = useCallback((lessonId: string, percent: number, completed: boolean) => {
    setCourseData(prev => {
      if (!prev) return null

      // Helper to count completed
      let completedCount = 0
      let totalLessons = 0

      const newModules = prev.modules.map(mod => {
        const newLessons = mod.lessons.map(l => {
          totalLessons++;
          const isTarget = l.id === lessonId
          const isCompleted = isTarget ? (l.completed || completed) : l.completed // Once completed, stays completed

          if (isCompleted) completedCount++

          if (isTarget) {
            return {
              ...l,
              completed: isCompleted,
              watchedPercentage: Math.max(l.watchedPercentage || 0, percent)
            }
          }
          return l
        })
        return { ...mod, lessons: newLessons }
      })

      // Check if current lesson in root prop also needs update (it usually does as it tracks active state)
      const newCurrentLesson = prev.currentLesson.id === lessonId ? {
        ...prev.currentLesson,
        watchedPercentage: Math.max(prev.currentLesson.watchedPercentage || 0, percent)
      } : prev.currentLesson

      const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      return {
        ...prev,
        modules: newModules,
        completedLessons: completedCount,
        progress: newProgress,
        currentLesson: newCurrentLesson
      }
    })
  }, [])

  const handleMarkComplete = async () => {
    if (!user || !courseData) {
      toast.error("You must be logged in to complete the course.");
      return;
    }

    setIsGeneratingCert(true);
    try {
      const cert = await createCertificate({
        userId: user.uid,
        courseId: courseData.id,
        studentName: user.displayName || "Student Name",
        courseName: courseData.title,
        instructorName: courseData.instructor,
        type: "BASIC"
      });

      toast.success("Course Completed! Certificate Generated.", {
        description: `Credential ID: ${cert.credentialId}`,
        action: {
          label: "View Certificate",
          onClick: () => window.location.href = "/dashboard/certificates"
        }
      });
    } catch (error) {
      console.error("Certificate generation failed:", error);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGeneratingCert(false);
    }
  };

  // Auto-generate certificate when course reaches 100%
  useEffect(() => {
    if (courseData && courseData.progress === 100 && !isGeneratingCert && user) {
      // Check if certificate already exists to avoid duplicate calls
      handleMarkComplete();
    }
  }, [courseData?.progress]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <p>Course not found.</p>
        <Link href="/dashboard/courses"><Button variant="outline">Back to Courses</Button></Link>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-background font-sans overflow-hidden">
      {/* Left Sidebar */}
      <CourseSidebar
        courseData={courseData}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        expandedModules={expandedModules}
        toggleModule={toggleModule}
        onLessonSelect={handleLessonSelect}
      />

      {/* Right Content - Main Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Top Bar for Mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content Container */}
        <ScrollArea className="flex-1 w-full h-full">
          <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <VideoPlayer
              courseData={courseData}
              onProgressUpdate={handleProgressUpdate}
            />

            <CourseTabs
              courseData={courseData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              newNote={newNote}
              setNewNote={setNewNote}
            />

            {/* Footer for single scroll end */}
            <div className="h-12" />
          </div>
        </ScrollArea>
      </main>

      {/* Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

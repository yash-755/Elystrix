"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, StickyNote, Play, Clock, BookOpen, Trash2, Edit, Filter } from "lucide-react"
import Link from "next/link"

const notesData = [
  {
    id: "1",
    content: "useEffect runs after every render by default. Use dependency array to control when it runs.",
    timestamp: "5:24",
    lessonTitle: "useEffect Deep Dive",
    courseTitle: "React Masterclass",
    courseId: "react-masterclass",
    lessonId: "l18",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    content: "Cleanup function is important for subscriptions, timers, and event listeners to prevent memory leaks.",
    timestamp: "12:30",
    lessonTitle: "useEffect Deep Dive",
    courseTitle: "React Masterclass",
    courseId: "react-masterclass",
    lessonId: "l18",
    createdAt: "2 hours ago",
  },
  {
    id: "3",
    content: "CSS Grid is best for 2D layouts, Flexbox for 1D. Use Grid for page layouts and Flexbox for components.",
    timestamp: "8:15",
    lessonTitle: "Modern CSS Layouts",
    courseTitle: "Advanced CSS Mastery",
    courseId: "css-mastery",
    lessonId: "l5",
    createdAt: "1 day ago",
  },
  {
    id: "4",
    content: "TypeScript generics allow creating reusable components that work with multiple types.",
    timestamp: "15:42",
    lessonTitle: "TypeScript Generics",
    courseTitle: "TypeScript Complete Guide",
    courseId: "typescript-guide",
    lessonId: "l12",
    createdAt: "3 days ago",
  },
  {
    id: "5",
    content: "Always validate user input on both client and server side for security.",
    timestamp: "22:10",
    lessonTitle: "Form Validation",
    courseTitle: "React Masterclass",
    courseId: "react-masterclass",
    lessonId: "l15",
    createdAt: "5 days ago",
  },
]

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const filteredNotes = notesData.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = !selectedCourse || note.courseId === selectedCourse
    return matchesSearch && matchesCourse
  })

  const courses = [...new Set(notesData.map((n) => n.courseTitle))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Notes</h1>
        <p className="text-muted-foreground">All your learning notes in one place</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCourse === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCourse(null)}
          >
            All
          </Button>
          {courses.map((course) => (
            <Button
              key={course}
              variant={selectedCourse === course ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCourse(selectedCourse === course ? null : course)}
              className="hidden sm:inline-flex"
            >
              {course.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <StickyNote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notesData.length}</p>
              <p className="text-xs text-muted-foreground">Total Notes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredNotes.length}</p>
              <p className="text-xs text-muted-foreground">Showing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <StickyNote className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-2">{note.content}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary">
                      <Play className="h-3 w-3 mr-1" />
                      {note.timestamp}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{note.lessonTitle}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <Link href={`/dashboard/courses/${note.courseId}`} className="text-xs text-primary hover:underline">
                      {note.courseTitle}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-14">{note.createdAt}</p>
            </CardContent>
          </Card>
        ))}

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-1">No notes found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Start taking notes while watching lessons"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

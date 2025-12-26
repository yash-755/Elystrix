"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bookmark, Play, Clock, Trash2, Grid3X3, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

const bookmarksData = [
  {
    id: "1",
    lessonTitle: "useEffect Deep Dive",
    courseTitle: "React Masterclass",
    courseId: "react-masterclass",
    lessonId: "l18",
    thumbnail: "/react-hooks-code.png",
    duration: "18:24",
    timestamp: "5:24",
    savedAt: "2 hours ago",
  },
  {
    id: "2",
    lessonTitle: "CSS Grid Masterclass",
    courseTitle: "Advanced CSS Mastery",
    courseId: "css-mastery",
    lessonId: "l5",
    thumbnail: "/css-grid-layout.png",
    duration: "25:30",
    timestamp: "12:45",
    savedAt: "1 day ago",
  },
  {
    id: "3",
    lessonTitle: "TypeScript Generics",
    courseTitle: "TypeScript Complete Guide",
    courseId: "typescript-guide",
    lessonId: "l12",
    thumbnail: "/typescript-code.png",
    duration: "32:15",
    timestamp: "8:20",
    savedAt: "3 days ago",
  },
  {
    id: "4",
    lessonTitle: "Authentication Flow",
    courseTitle: "Node.js Backend Development",
    courseId: "nodejs-backend",
    lessonId: "l8",
    thumbnail: "/nodejs-authentication.jpg",
    duration: "28:00",
    timestamp: "15:30",
    savedAt: "5 days ago",
  },
  {
    id: "5",
    lessonTitle: "State Management with Redux",
    courseTitle: "React Masterclass",
    courseId: "react-masterclass",
    lessonId: "l25",
    thumbnail: "/redux-state-management.png",
    duration: "35:45",
    timestamp: "20:10",
    savedAt: "1 week ago",
  },
]

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredBookmarks = bookmarksData.filter(
    (bookmark) =>
      bookmark.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-muted-foreground">Lessons you&apos;ve saved for later</p>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{filteredBookmarks.length} bookmarks</span>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn("rounded-none", viewMode === "grid" && "bg-secondary")}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("rounded-none", viewMode === "list" && "bg-secondary")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bookmarks */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="group overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={bookmark.thumbnail || "/placeholder.svg"}
                  alt={bookmark.lessonTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href={`/dashboard/courses/${bookmark.courseId}`}>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Play className="h-4 w-4 mr-1" />
                      Resume at {bookmark.timestamp}
                    </Button>
                  </Link>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/70 text-white">{bookmark.duration}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm line-clamp-1">{bookmark.lessonTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{bookmark.courseTitle}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">Saved {bookmark.savedAt}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={bookmark.thumbnail || "/placeholder.svg"}
                    alt={bookmark.lessonTitle}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-xs">
                    {bookmark.duration}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1">{bookmark.lessonTitle}</h3>
                  <p className="text-sm text-muted-foreground">{bookmark.courseTitle}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-primary border-primary">
                      <Clock className="h-3 w-3 mr-1" />
                      {bookmark.timestamp}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Saved {bookmark.savedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/courses/${bookmark.courseId}`}>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredBookmarks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No bookmarks found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Save lessons to watch them later"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

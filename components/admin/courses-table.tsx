"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
} from "lucide-react"
import Link from "next/link"
import { deleteCourse, togglePublishCourse } from "@/actions/courses"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Course = {
    id: string
    title: string
    category: { name: string } | null
    level: string | null
    published: boolean
    price: number
    updatedAt: string
    deletedAt?: string | null
}

export function CoursesTable({ initialCourses }: { initialCourses: any[] }) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Filter out soft-deleted courses client-side if they somehow came through prop
    const activeCourses = initialCourses.filter(c => !c.deletedAt)

    // Client-side filtering
    const filteredCourses = activeCourses.filter((course) => {
        return course.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
        setLoadingId(courseId)
        try {
            const result = await togglePublishCourse(courseId, !currentStatus)
            if (result.success) {
                toast.success(currentStatus ? "Course unpublished" : "Course published")
                router.refresh()
            } else {
                toast.error("Failed to update status")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoadingId(null)
        }
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        setLoadingId(deleteId)
        try {
            const result = await deleteCourse(deleteId)
            if (result.success) {
                toast.success("Course deleted")
                router.refresh()
            } else {
                toast.error("Failed to delete course")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoadingId(null)
            setDeleteId(null)
        }
    }

    const getStatusBadge = (published: boolean) => {
        if (published) {
            return (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Published
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Draft
                </Badge>
            )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Course Management</h1>
                    <p className="text-muted-foreground">Create, edit, and manage all courses</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/courses/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Course
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Courses Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCourses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No courses found.</TableCell>
                                </TableRow>
                            ) : filteredCourses.map((course) => (
                                <TableRow key={course.id} className={loadingId === course.id ? "opacity-50" : ""}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">Updated {new Date(course.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {typeof course.category === 'object' ? course.category?.name : course.category || "Uncategorized"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{course.difficulty || course.level || "Beginner"}</TableCell>
                                    <TableCell>{getStatusBadge(course.published)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={loadingId === course.id}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/courses/${course.id}`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(course.id, course.published)}>
                                                    {course.published ? (
                                                        <>
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Publish
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500"
                                                    onClick={() => setDeleteId(course.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the course from the public view and admin list.
                            (It can be restored by super-admins if needed).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete Course
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

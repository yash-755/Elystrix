"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, LayoutGrid, TrendingUp, Clock, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardOverviewPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        completedEnrollments: 0,
        certificatesCount: 0,
        quizAttemptsCount: 0,
        enrolledPathsCount: 0,
        recentEnrollment: null as any
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (!user) return

        async function fetchStats() {
            try {
                const res = await fetch(`/api/dashboard/stats?userId=${user.uid}`)
                const data = await res.json()
                setStats(data)
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [user])

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const inProgressCount = stats.totalEnrollments - stats.completedEnrollments


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.displayName || "Student"}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses In Progress</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalEnrollments} total enrolled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certificatesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedEnrollments} courses completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Learning Paths</CardTitle>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.enrolledPathsCount}</div>
                        <p className="text-xs text-muted-foreground">Enrolled paths</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.quizAttemptsCount}</div>
                        <p className="text-xs text-muted-foreground">Total attempts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Continue Learning */}
            {stats.recentEnrollment && (
                <Card>
                    <CardHeader>
                        <CardTitle>Continue Learning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href={`/dashboard/courses/${stats.recentEnrollment.course.slug}`}
                            className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{stats.recentEnrollment.course.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {stats.recentEnrollment.progress}% complete
                                </p>
                            </div>
                            <div className="text-sm font-medium text-primary">Continue →</div>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/courses">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Browse Courses</h3>
                                <p className="text-sm text-muted-foreground">Explore new courses</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/paths">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <LayoutGrid className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Learning Paths</h3>
                                <p className="text-sm text-muted-foreground">Structured roadmaps</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/certificates">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">My Certificates</h3>
                                <p className="text-sm text-muted-foreground">View your achievements</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Empty State for New Users */}
            {stats.totalEnrollments === 0 && (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Start Your Learning Journey</h3>
                        <p className="text-muted-foreground mb-4">
                            You haven&apos;t enrolled in any courses yet. Browse our catalog to get started!
                        </p>
                        <Link href="/courses">
                            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                Browse Courses
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

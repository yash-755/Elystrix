import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  Award,
  ClipboardList,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Parallel Data Fetching
  const [
    totalStudents,
    totalCourses,
    totalCertificates,
    activeSubs,
    quizAttempts,
    courseDistribution,
    planDistribution,
    recentUsers,
    recentCourses,
    recentCerts
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.course.count(),
    prisma.certificate.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.quizAttempt.count(),
    prisma.course.groupBy({ by: ["published"], _count: true }),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.user.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.certificate.findMany({ take: 3, orderBy: { createdAt: "desc" } })
  ])

  // Process Stats
  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      change: "Real-time",
      trend: "neutral",
      icon: Users,
    },
    {
      title: "Total Courses",
      value: totalCourses.toLocaleString(),
      change: "Real-time",
      trend: "neutral",
      icon: BookOpen,
    },
    {
      title: "Certificates Issued",
      value: totalCertificates.toLocaleString(),
      change: "Real-time",
      trend: "neutral",
      icon: Award,
    },
    {
      title: "Active Subscriptions",
      value: activeSubs.toLocaleString(),
      change: "Real-time",
      trend: "neutral",
      icon: CreditCard,
    },
    {
      title: "Quiz Attempts",
      value: quizAttempts.toLocaleString(),
      change: "Real-time",
      trend: "neutral",
      icon: ClipboardList,
    },
  ]

  // Process Recent Activity
  const activities = [
    ...recentUsers.map(u => ({
      type: "user",
      message: `New user registration: ${u.email}`,
      time: u.createdAt,
      status: "new"
    })),
    ...recentCourses.map(c => ({
      type: "course",
      message: `Course '${c.title}' ${c.published ? "published" : "created"}`,
      time: c.createdAt,
      status: "success"
    })),
    ...recentCerts.map(c => ({
      type: "certificate",
      message: `Certificate issued to ${c.studentName}`,
      time: c.createdAt,
      status: "success"
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

  // Process Course Stats
  const publishedCount = courseDistribution.find(d => d.published === true)?._count || 0
  const draftCount = courseDistribution.find(d => d.published === false)?._count || 0
  const courseStats = [
    { name: "Published", count: publishedCount, percentage: totalCourses ? Math.round((publishedCount / totalCourses) * 100) : 0, color: "bg-green-500" },
    { name: "Draft", count: draftCount, percentage: totalCourses ? Math.round((draftCount / totalCourses) * 100) : 0, color: "bg-yellow-500" },
  ]

  // Process Subscription Stats
  const subscriptionBreakdown = planDistribution.map(p => ({
    plan: p.plan || "Free",
    users: p._count,
    percentage: totalStudents ? Math.round((p._count / totalStudents) * 100) : 0
  })).sort((a, b) => b.users - a.users)

  const pendingTasks: any[] = [] // Empty for now as we don't have task system
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/courses/new">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge
                  variant="outline"
                  className={
                    stat.trend === "up" ? "text-green-600 border-green-600" : "text-yellow-600 border-yellow-600"
                  }
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </div>
            <Link href="/admin/logs">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                ) : (
                  activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                            ? "bg-yellow-500"
                            : activity.status === "new"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task, idx) => (
                <Link key={idx} href={task.link}>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          }`}
                      />
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Status */}
        <Card>
          <CardHeader>
            <CardTitle>Course Status</CardTitle>
            <CardDescription>Overview of course states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseStats.map((stat) => (
                <div key={stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stat.name}</span>
                    <span className="text-muted-foreground">
                      {stat.count} courses ({stat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Link href="/admin/courses">
                <Button variant="outline" size="sm">
                  Manage Courses
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Users by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptionBreakdown.map((sub) => (
                <div key={sub.plan} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{sub.plan}</div>
                  <div className="flex-1">
                    <Progress value={sub.percentage} className="h-2" />
                  </div>
                  <div className="w-20 text-right text-sm text-muted-foreground">{sub.users.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Link href="/admin/subscriptions">
                <Button variant="outline" size="sm">
                  View Subscriptions
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

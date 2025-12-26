import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AdminPathActions } from "@/components/admin/path-actions-dropdown"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Route,
  Users,
  BookOpen,
  Award,
} from "lucide-react"
import { getAdminLearningPaths } from "@/app/actions/learning-paths"

export const dynamic = "force-dynamic"

export default async function AdminPathsPage() {
  const paths = await getAdminLearningPaths()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Learning Paths</h1>
          <p className="text-muted-foreground">Create and manage learning paths</p>
        </div>
        <Link href="/admin/paths/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Path
          </Button>
        </Link>
      </div>

      {/* Stats - Real counts */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{paths.length}</p>
              <p className="text-xs text-muted-foreground">Total Paths</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paths Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {paths.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-muted-foreground">No paths found. Create one!</div>
        ) : paths.map((path: any) => (
          <Card key={path.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{path.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
                </div>
                <AdminPathActions id={path.id} slug={path.slug} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{path._count.nodes} nodes</Badge>
                <Badge variant="outline">{path.certificateType || "BASIC"}</Badge>
                {path.published ? (
                  <Badge className="bg-green-500/10 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Draft
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

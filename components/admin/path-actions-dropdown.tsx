"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Route, Trash2 } from "lucide-react"
import { deleteLearningPath } from "@/app/actions/learning-paths"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PathActionsProps {
    id: string
    slug: string
}

export function AdminPathActions({ id, slug }: PathActionsProps) {
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        console.log('[DELETE] Starting delete for path ID:', id)

        if (!confirm("Are you sure you want to delete this Learning Path? This cannot be undone.")) {
            console.log('[DELETE] User cancelled deletion')
            return
        }

        console.log('[DELETE] User confirmed, calling deleteLearningPath...')
        const res = await deleteLearningPath(id)

        console.log('[DELETE] Server response:', res)

        if (res.success) {
            toast.success("Path deleted successfully")
            console.log('[DELETE] Success! Refreshing page...')
            router.refresh()
        } else {
            toast.error(res.error || "Failed to delete path")
            console.error('[DELETE] Error:', res.error)
        }
    }

    const handlePreview = () => {
        window.open(`/paths/${slug || id}`, '_blank')
    }

    const handleBuilder = (e: React.MouseEvent) => {
        e.preventDefault()
        router.push(`/admin/paths/${id}/builder`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBuilder}>
                    <Route className="h-4 w-4 mr-2" />
                    Roadmap Builder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={handleDelete}
                    onSelect={(e) => e.preventDefault()}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

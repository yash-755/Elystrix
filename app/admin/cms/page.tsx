"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, FileText, CheckCircle, Save, Loader2 } from "lucide-react"
import { listCMSPages, updateCMSPage, type CMSPageData } from "@/app/actions/cms"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { CMS_DEFAULTS } from "@/lib/cms-defaults"

// Default pages we want to ensure exist in the UI list even if not in DB yet
const DEFAULT_PAGES = [
  { slug: "terms", title: "Terms of Service" },
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "about", title: "About Us" },
  { slug: "faq", title: "FAQ" },
  { slug: "security", title: "Security" },
  { slug: "footer", title: "Footer Content" },
]

export default function AdminCMSPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<Partial<CMSPageData> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const dbPages = await listCMSPages()
      // Merge DB pages with default list to ensure they appear
      const merged = DEFAULT_PAGES.map(def => {
        const existing = dbPages.find((p: any) => p.slug === def.slug)
        // If it exists, use it. If not, use default structure AND default content
        return existing || {
          ...def,
          status: "draft",
          lastUpdated: "Never",
          content: CMS_DEFAULTS[def.slug] || ""
        }
      })
      setPages(merged)
    } catch (error) {
      console.error("Failed to load pages", error)
      toast.error("Failed to load CMS pages")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (page: any) => {
    setEditingPage({ ...page }) // Clone to avoid reference issues
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingPage?.slug) return

    const toastId = toast.loading("Saving changes...")

    try {
      // Optimistic update (optional, but let's stick to safe wait)
      const res = await updateCMSPage(editingPage.slug!, editingPage)

      if (res.success) {
        toast.success("Page saved successfully", { id: toastId })
        setIsDialogOpen(false)
        setEditingPage(null)
        // Refresh list to show updated data
        await loadPages()
      } else {
        toast.error(`Failed to save: ${res.error}`, { id: toastId })
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { id: toastId })
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CMS Pages</h1>
        <p className="text-muted-foreground">Manage website content and legal pages</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card key={page.slug} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  {page.status === "published" ? (
                    <Badge className="bg-green-500/10 text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Draft
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{page.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">Slug: /{page.slug}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/${page.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Link>
                  </Button>

                  <Button size="sm" className="flex-1" onClick={() => handleEditClick(page)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit {editingPage?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={editingPage?.title || ""}
                onChange={e => setEditingPage(prev => ({ ...prev!, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Content (Markdown/HTML)</Label>
              <Textarea
                className="min-h-[500px] font-mono text-sm leading-relaxed"
                value={editingPage?.content || ""}
                onChange={e => setEditingPage(prev => ({ ...prev!, content: e.target.value }))}
                placeholder="# Page Title\n\nWrite your content here in Markdown/HTML..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={editingPage?.status || "draft"}
                onValueChange={(val: any) => setEditingPage(prev => ({ ...prev!, status: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

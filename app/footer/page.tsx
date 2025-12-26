import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Footer Content - Elystrix",
    description: "Preview of footer content.",
    robots: "noindex, nofollow"
}

export const dynamic = 'force-dynamic'

export default function FooterContentPage() {
    return (
        <div className="border-4 border-dashed border-yellow-500/50 min-h-screen">
            <div className="bg-yellow-500/20 text-yellow-500 p-2 text-center font-mono font-bold uppercase tracking-widest text-xs">
                Admin Preview Mode: Footer Content
            </div>
            <CMSPageRenderer slug="footer" title="Footer Content" />
        </div>
    )
}

import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Security - Elystrix",
    description: "Security practices and policies at Elystrix.",
}

export const dynamic = 'force-dynamic'

export default function SecurityPage() {
    return <CMSPageRenderer slug="security" title="Security" />
}

import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service - Elystrix",
    description: "Terms and conditions for using Elystrix.",
}

export const dynamic = 'force-dynamic'

export default function TermsPage() {
    return <CMSPageRenderer slug="terms" title="Terms of Service" />
}

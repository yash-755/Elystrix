import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy - Elystrix",
    description: "Privacy policy for Elystrix.",
}

export const dynamic = 'force-dynamic'

export default function PrivacyPage() {
    return <CMSPageRenderer slug="privacy" title="Privacy Policy" />
}

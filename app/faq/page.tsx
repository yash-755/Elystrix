import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Elystrix",
  description: "Common questions and answers about Elystrix.",
}

export const dynamic = 'force-dynamic'

export default function FAQPage() {
  return <CMSPageRenderer slug="faq" title="Frequently Asked Questions" />
}

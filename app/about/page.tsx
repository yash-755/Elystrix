import { CMSPageRenderer } from "@/components/cms/cms-page-renderer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Elystrix",
  description: "Learn more about Elystrix and our mission.",
}

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return <CMSPageRenderer slug="about" title="About Us" />
}

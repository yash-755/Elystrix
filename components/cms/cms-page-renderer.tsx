import { notFound } from "next/navigation"
import { getCMSPage } from "@/app/actions/cms"

interface CMSPageRendererProps {
    slug: string
    title: string
    description?: string // For metadata or fallback
}

function parseMarkdown(content: string) {
    if (!content) return null

    // Split by double newline to get blocks
    const blocks = content.split(/\n\n+/)

    return blocks.map((block, index) => {
        const trimmed = block.trim()

        if (trimmed.startsWith('# ')) {
            return <h1 key={index} className="text-4xl font-bold mb-6 mt-8">{trimmed.substring(2)}</h1>
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mb-4 mt-8">{trimmed.substring(3)}</h2>
        }
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold mb-3 mt-6">{trimmed.substring(4)}</h3>
        }

        // Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s/, ''))
            return (
                <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                    {items.map((item, i) => {
                        // Simple link parser: [text](url)
                        const linkMatch = item.match(/\[(.*?)\]\((.*?)\)/)
                        if (linkMatch) {
                            const before = item.substring(0, linkMatch.index)
                            const text = linkMatch[1]
                            const url = linkMatch[2]
                            const after = item.substring((linkMatch.index || 0) + linkMatch[0].length)
                            return <li key={i}>{before}<a href={url} className="text-primary hover:underline">{text}</a>{after}</li>
                        }
                        return <li key={i}>{item}</li>
                    })}
                </ul>
            )
        }

        // Paragraphs
        return <p key={index} className="mb-4 text-muted-foreground leading-relaxed">{trimmed}</p>
    })
}

export async function CMSPageRenderer({ slug, title }: CMSPageRendererProps) {
    const page = await getCMSPage(slug)

    // If page is missing or empty, show coming soon
    if (!page || !page.content) {
        return (
            <div className="container mx-auto py-24 text-center">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <p className="text-muted-foreground text-lg">This page is currently being updated. Please check back soon.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-16 max-w-4xl px-4 md:px-6">
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{page.title}</h1>
                {page.updatedAt && (
                    <p className="text-sm text-muted-foreground">
                        Last Updated: {page.updatedAt.toLocaleDateString()}
                    </p>
                )}
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
                {parseMarkdown(page.content)}
            </div>
        </div>
    )
}

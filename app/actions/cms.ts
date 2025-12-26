"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"

export type CMSPageData = {
    slug: string
    title: string
    content: string
    status: "published" | "draft"
}

/**
 * Fetches a CMS page by slug.
 * Returns null if not found or (optionally) if not published (unless admin).
 */
export async function getCMSPage(slug: string, showDraft = false) {
    try {
        const page = await prisma.cMSPage.findUnique({
            where: { slug },
        })

        if (!page) return null
        if (page.status !== "published" && !showDraft) return null

        return page
    } catch (error) {
        console.error(`Error fetching CMS page ${slug}:`, error)
        return null
    }
}

/**
 * Updates or Creates a CMS page.
 * Used by the Admin Panel.
 */
export async function updateCMSPage(slug: string, data: Partial<CMSPageData>) {
    console.log(`[CMS] Updating page: ${slug}`, { title: data.title, status: data.status, contentLength: data.content?.length })

    // Sanitize input - only allow specific fields to be updated
    const safeData = {
        title: data.title,
        content: data.content,
        status: data.status,
    }

    try {
        const page = await prisma.cMSPage.upsert({
            where: { slug },
            update: {
                ...safeData,
                updatedAt: new Date(),
                publishedAt: safeData.status === 'published' ? new Date() : undefined
            },
            create: {
                slug,
                title: safeData.title || "Untitled Page",
                content: safeData.content || "",
                status: safeData.status || "draft",
                publishedAt: safeData.status === 'published' ? new Date() : undefined
            },
        })

        console.log(`[CMS] Page updated successfully: ${slug}`)
        revalidatePath(`/admin/cms`)
        revalidatePath(`/${slug}`)
        return { success: true, page }
    } catch (error: any) {
        console.error(`[CMS] Error updating page ${slug}:`, error)
        return { success: false, error: error.message || "Database error" }
    }
}

/**
 * Lists all CMS pages for the Admin Dashboard.
 */
export async function listCMSPages() {
    try {
        const pages = await prisma.cMSPage.findMany({
            orderBy: { updatedAt: 'desc' }
        })
        return pages
    } catch (error) {
        console.error("Error listing CMS pages:", error)
        return []
    }
}

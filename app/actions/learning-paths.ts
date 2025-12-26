"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Learning Path Operations ---

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export async function getAdminLearningPaths() {
    try {
        return await prisma.learningPath.findMany({
            orderBy: { updatedAt: "desc" },
            include: {
                _count: {
                    select: { nodes: true }
                }
            }
        })
    } catch (error: any) {
        console.error("getAdminLearningPaths error:", error)
        return []
    }
}

export async function getLearningPathById(id: string) {
    try {
        return await prisma.learningPath.findUnique({
            where: { id },
            include: {
                nodes: {
                    orderBy: { order: "asc" },
                    include: {
                        courses: {
                            include: { course: true }
                        }
                    }
                }
            }
        })
    } catch (error: any) {
        console.error("getLearningPathById error:", error)
        return null
    }
}

export async function getLearningPathBySlug(slug: string) {
    try {
        return await prisma.learningPath.findUnique({
            where: { slug },
            include: {
                nodes: {
                    orderBy: { order: "asc" },
                    include: {
                        courses: {
                            include: { course: true }
                        }
                    }
                }
            }
        })
    } catch (error: any) {
        console.error("getLearningPathBySlug error:", error)
        return null
    }
}

export async function getPublicLearningPaths() {
    try {
        return await prisma.learningPath.findMany({
            where: { published: true },
            orderBy: { updatedAt: "desc" },
            include: {
                _count: {
                    select: { nodes: true }
                }
            }
        })
    } catch (error: any) {
        console.error("getPublicLearningPaths error:", error)
        return []
    }
}

export async function createLearningPath(data: { title: string; slug?: string; description?: string }) {
    try {
        // Auto-generate slug from title if not provided
        const slug = data.slug || generateSlug(data.title)

        const path = await prisma.learningPath.create({
            data: {
                title: data.title,
                slug: slug,
                description: data.description,
                published: false
            }
        })
        revalidatePath("/admin/paths")
        revalidatePath("/dashboard")
        revalidatePath("/paths")
        return { success: true, data: path }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateLearningPath(id: string, data: Partial<{ title: string; slug: string; description: string; published: boolean; certificateType: string }>) {
    try {
        const path = await prisma.learningPath.update({
            where: { id },
            data: data as any // Case to any to avoid complex type mismatch during migration
        })
        revalidatePath("/admin/paths")
        revalidatePath(`/admin/paths/${id}/builder`)
        revalidatePath("/dashboard")
        revalidatePath("/paths")
        revalidatePath(`/paths/${path.slug}`)
        revalidatePath(`/dashboard/paths/${path.id}`)
        return { success: true, data: path }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteLearningPath(id: string) {
    try {
        await prisma.learningPath.delete({ where: { id } })
        revalidatePath("/admin/paths")
        revalidatePath("/dashboard")
        revalidatePath("/paths")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Course Selection Helpers ---

export async function getAllCoursesForSelector() {
    try {
        return await (prisma as any).Course.findMany({
            where: {
                published: true
            },
            select: {
                id: true,
                title: true
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error: any) {
        console.error("getAllCoursesForSelector error:", error)
        return []
    }
}

// --- Node Operations ---

export async function addNodeToPath(learningPathId: string, data: { title: string; type: string; difficulty: string }) {
    try {
        // Find highest order to append
        const lastNode = await prisma.learningPathNode.findFirst({
            where: { learningPathId },
            orderBy: { order: "desc" }
        })
        const newOrder = (lastNode?.order ?? 0) + 1

        const node = await prisma.learningPathNode.create({
            data: {
                learningPathId,
                title: data.title,
                type: data.type,
                difficulty: data.difficulty,
                order: newOrder
            }
        })
        revalidatePath(`/admin/paths/${learningPathId}/builder`)
        revalidatePath(`/dashboard/paths/${learningPathId}`)
        revalidatePath(`/paths`) // Ideally fetch slug but this is acceptable fallback
        return { success: true, data: node }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateNode(id: string, data: Partial<{ title: string; description: string; type: string; difficulty: string }>) {
    try {
        const node = await prisma.learningPathNode.update({
            where: { id },
            data
        })
        revalidatePath(`/admin/paths/${node.learningPathId}/builder`)
        revalidatePath(`/dashboard/paths/${node.learningPathId}`)
        return { success: true, data: node }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteNode(id: string) {
    try {
        const node = await prisma.learningPathNode.findUnique({ where: { id } })
        if (node) {
            await prisma.learningPathNode.delete({ where: { id } })
            revalidatePath(`/admin/paths/${node.learningPathId}/builder`)
            revalidatePath(`/dashboard/paths/${node.learningPathId}`)
        }
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function swapNodesOrder(nodeId1: string, nodeId2: string) {
    // Transactional wap
    try {
        const n1 = await prisma.learningPathNode.findUnique({ where: { id: nodeId1 } })
        const n2 = await prisma.learningPathNode.findUnique({ where: { id: nodeId2 } })

        if (!n1 || !n2) throw new Error("Nodes not found")

        await prisma.$transaction([
            prisma.learningPathNode.update({ where: { id: nodeId1 }, data: { order: n2.order } }),
            prisma.learningPathNode.update({ where: { id: nodeId2 }, data: { order: n1.order } })
        ])

        revalidatePath(`/admin/paths/${n1.learningPathId}/builder`)
        revalidatePath(`/dashboard/paths/${n1.learningPathId}`)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function attachCourseToNode(nodeId: string, courseId: string) {
    try {
        const node = await prisma.learningPathNode.findUnique({ where: { id: nodeId } })
        await prisma.learningPathNodeCourse.create({
            data: { nodeId, courseId }
        })
        if (node) {
            revalidatePath(`/admin/paths/${node.learningPathId}/builder`)
            revalidatePath(`/dashboard/paths/${node.learningPathId}`)
        }
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function removeCourseFromNode(nodeId: string, courseId: string) {
    try {
        const node = await prisma.learningPathNode.findUnique({ where: { id: nodeId } })
        await prisma.learningPathNodeCourse.deleteMany({
            where: { nodeId, courseId }
        })
        if (node) {
            revalidatePath(`/admin/paths/${node.learningPathId}/builder`)
            revalidatePath(`/dashboard/paths/${node.learningPathId}`)
        }
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- User Operations ---

export async function getUserLearningPaths(firebaseUid: string) {
    try {
        // 1. Resolve User ID from Firebase UID
        const user = await prisma.user.findUnique({
            where: { firebaseUid }
        })

        if (!user) {
            // If user doesn't exist in our DB yet (rendering issue?), return empty
            return { enrolled: [], recommended: [] }
        }

        // 2. Fetch enrolled paths using internal ObjectId
        const userPaths = await prisma.userLearningPath.findMany({
            where: { userId: user.id },
            include: { learningPath: true }
        })

        // Fetch all published paths as recommendations (simple logic: not enrolled)
        const enrolledIds = userPaths.map((up: any) => up.learningPathId)
        const recommended = await prisma.learningPath.findMany({
            where: {
                published: true,
                id: { notIn: enrolledIds }
            },
            take: 5
        })

        return {
            enrolled: userPaths.map((up: any) => ({
                ...up.learningPath,
                progress: up.progress,
                status: up.status,
                certificateType: up.learningPath.certificateType
            })),
            recommended
        }
    } catch (error: any) {
        console.error("getUserLearningPaths error:", error)
        return { enrolled: [], recommended: [] }
    }
}

export async function getUserLearningPathProgress(firebaseUid: string, learningPathId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { firebaseUid } })
        if (!user) return null

        return await prisma.userLearningPath.findUnique({
            where: {
                userId_learningPathId: {
                    userId: user.id,
                    learningPathId
                }
            }
        })
    } catch (error: any) {
        console.error("getUserLearningPathProgress error:", error)
        return null
    }
}

export async function markNodeAsComplete(firebaseUid: string, learningPathId: string, nodeId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { firebaseUid } })
        if (!user) throw new Error("User not found")

        // Get Path and Node count
        const path = await prisma.learningPath.findUnique({
            where: { id: learningPathId },
            include: { nodes: true }
        })
        if (!path) throw new Error("Path not found")

        // Get User Progress
        let userPath = await prisma.userLearningPath.findUnique({
            where: { userId_learningPathId: { userId: user.id, learningPathId } }
        })

        // Initialize if not exists
        if (!userPath) {
            userPath = await prisma.userLearningPath.create({
                data: {
                    userId: user.id,
                    learningPathId,
                    completedNodeIds: []
                }
            })
        }

        // Add node if not already completed
        let completedIds = userPath.completedNodeIds || []
        if (!completedIds.includes(nodeId)) {
            completedIds.push(nodeId)
        } else {
            return { success: true, message: "Already completed" }
        }

        // Calculate Progress
        const totalNodes = path.nodes.length
        const progress = totalNodes > 0 ? Math.round((completedIds.length / totalNodes) * 100) : 0
        const status = progress === 100 ? "completed" : "in-progress"
        const completedAt = progress === 100 ? new Date() : null

        await prisma.userLearningPath.update({
            where: { id: userPath.id },
            data: {
                completedNodeIds: completedIds,
                progress,
                status,
                completedAt
            }
        })

        revalidatePath("/dashboard/paths")
        revalidatePath(`/dashboard/paths/${learningPathId}`)

        return { success: true, progress, status }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function enrollUserInPath(firebaseUid: string, learningPathId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { firebaseUid } })
        if (!user) throw new Error("User not found")

        const existing = await prisma.userLearningPath.findUnique({
            where: {
                userId_learningPathId: {
                    userId: user.id,
                    learningPathId
                }
            }
        })

        if (existing) {
            return { success: true, message: "Already enrolled" }
        }

        await prisma.userLearningPath.create({
            data: {
                userId: user.id,
                learningPathId,
                progress: 0,
                status: "in-progress",
                completedNodeIds: []
            }
        })

        revalidatePath("/dashboard/paths")
        revalidatePath(`/dashboard/paths/${learningPathId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

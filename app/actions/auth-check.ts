"use server"

import { prisma } from "@/lib/prisma"

export async function isAdmin(firebaseUid: string) {
    if (!firebaseUid) return false

    const user = await prisma.user.findUnique({
        where: { firebaseUid },
        select: { role: true }
    })

    return user?.role === 'admin' || user?.role === 'superadmin'
}

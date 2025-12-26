"use server"

import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

/**
 * Ensures a Prisma user exists for the given Firebase UID.
 * Should be called on login or before any data operation.
 */
export async function ensureUser(
    firebaseUid: string,
    email: string,
    name?: string | null
): Promise<User> {
    // upsert handles "find if exists, else create"
    // We strictly identify by firebaseUid
    const user = await prisma.user.upsert({
        where: { firebaseUid },
        update: {
            // Optional: Update name/email if changed in Firebase?
            // For now, let's keep it simple and just ensure existence.
            // We might want to update email if it changed.
            email,
            name: name || undefined,
        },
        create: {
            firebaseUid,
            email,
            name: name || "Student",
        },
    });
    return user;
}

export async function getUserByFirebaseId(firebaseUid: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { firebaseUid },
    });
}

export async function updateUserImage(firebaseUid: string, imageUrl: string): Promise<User> {
    return prisma.user.update({
        where: { firebaseUid },
        data: { image: imageUrl },
    });
}

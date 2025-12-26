"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactMessage(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    }

    const validatedFields = contactSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors }
    }

    try {
        await (prisma as any).contactMessage.create({
            data: validatedFields.data,
        })

        revalidatePath("/admin/contact")
        return { success: true }
    } catch (error) {
        console.error("Failed to submit contact message:", error)
        return { success: false, error: "Failed to send message. Please try again." }
    }
}

export async function getAllContactMessages() {
    try {
        const messages = await (prisma as any).contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        })
        return { success: true, messages }
    } catch (error) {
        console.error("Failed to fetch contact messages:", error)
        return { success: false, error: "Failed to fetch messages" }
    }
}

export async function deleteContactMessage(id: string) {
    try {
        await (prisma as any).contactMessage.delete({
            where: { id },
        })

        revalidatePath("/admin/contact")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete contact message:", error)
        return { success: false, error: "Failed to delete message" }
    }
}

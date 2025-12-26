"use server"

import { updateUserImage } from "@/lib/users";
import { revalidatePath } from "next/cache";

export async function updateUserImageAction(firebaseUid: string, imageUrl: string) {
    try {
        await updateUserImage(firebaseUid, imageUrl);
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update user image:", error);
        return { success: false, error: "Failed to update profile image" };
    }
}

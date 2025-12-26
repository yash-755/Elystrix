import { redirect } from "next/navigation"
import { getUserProfile } from "@/app/actions/user"

// Use Client Component for consistency with existing dashboard pages 
// to ensure we get the correct Firebase User UID from the client SDK.

import ProfilePreviewClient from "./profile-preview-client"

export default function ProfilePage() {
    return <ProfilePreviewClient />
}

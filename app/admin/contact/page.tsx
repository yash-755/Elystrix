import { ContactMessagesTable } from "@/components/admin/contact-table"
import { getAllContactMessages } from "@/app/actions/contact"

export const dynamic = "force-dynamic"

export default async function AdminContactPage() {
    const result = await getAllContactMessages()
    const messages = result.success && result.messages ? result.messages : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Inbox</h1>
                    <p className="text-muted-foreground">Manage incoming messages from the contact form.</p>
                </div>
            </div>

            <ContactMessagesTable initialMessages={messages} />
        </div>
    )
}

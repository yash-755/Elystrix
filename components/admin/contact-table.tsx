"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Loader2, RefreshCw } from "lucide-react"
import { deleteContactMessage } from "@/app/actions/contact"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    createdAt: Date
}

interface ContactMessagesTableProps {
    initialMessages: Message[]
}

export function ContactMessagesTable({ initialMessages }: ContactMessagesTableProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this message?")) return

        setLoadingId(id)
        try {
            const result = await deleteContactMessage(id)
            if (result.success) {
                toast.success("Message deleted")
                router.refresh()
            } else {
                toast.error("Failed to delete message")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Sender</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialMessages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No messages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialMessages.map((msg) => (
                                <TableRow key={msg.id} className={loadingId === msg.id ? "opacity-50" : ""}>
                                    <TableCell className="w-[150px] text-xs text-muted-foreground">
                                        {new Date(msg.createdAt).toLocaleDateString()} <br />
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell className="w-[200px]">
                                        <div className="font-medium">{msg.name}</div>
                                        <div className="text-sm text-muted-foreground">{msg.email}</div>
                                    </TableCell>
                                    <TableCell className="w-[150px] md:w-[200px] font-medium text-amber-500/90">
                                        {msg.subject}
                                    </TableCell>
                                    <TableCell className="max-w-[400px]">
                                        <div className="truncate text-sm text-muted-foreground" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(msg.id)}
                                            disabled={loadingId === msg.id}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                            {loadingId === msg.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

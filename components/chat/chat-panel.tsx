import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "./chat-interface"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
    const [mounted, setMounted] = useState(false)


    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sliding Panel */}
            <div
                id="ai-assistant-panel"
                className={cn(
                    "fixed right-0 top-0 h-full w-full sm:w-[400px] z-[9999] bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                role="dialog"
                aria-modal="true"
                aria-label="AI Assistant"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <h2 className="font-semibold text-lg">AI Assistant</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted" aria-label="Close Assistant">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 overflow-hidden">
                    <ChatInterface />
                </div>
            </div>
        </>,
        document.body
    )
}

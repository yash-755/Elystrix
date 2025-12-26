"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
// Imports for Scroll Isolation
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { ScrollBar } from "@/components/ui/scroll-area"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages((prev) => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || "Failed to search")
            }

            const data = await response.json()
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
        } catch (error: any) {
            console.error("Chat error:", error)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error.message || "AI is temporarily unavailable. Please try again.",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background/95">
            <ScrollAreaPrimitive.Root className="flex-1 relative overflow-hidden">
                <ScrollAreaPrimitive.Viewport
                    className="h-full w-full rounded-[inherit] overscroll-contain p-4"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-4">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Elystrix Assistant</h3>
                            <p className="text-sm max-w-[250px]">
                                Ask anything about Elystrix courses, learning paths, or certifications.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-start gap-3 text-sm",
                                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <Avatar className="w-8 h-8 border border-border">
                                        {msg.role === "user" ? (
                                            <>
                                                <AvatarImage src="/diverse-avatars.png" />
                                                <AvatarFallback>U</AvatarFallback>
                                            </>
                                        ) : (
                                            <>
                                                <AvatarImage src="" /> {/* Fallback to icon */}
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <Bot className="w-4 h-4" />
                                                </AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg max-w-[85%] leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted/50 border border-border/50 text-foreground"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8 border border-border">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <Bot className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted/50 border border-border/50 p-3 rounded-lg flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar />
                <ScrollAreaPrimitive.Corner />
            </ScrollAreaPrimitive.Root>

            <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about courses..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-1 bg-muted/50 focus-visible:ring-primary/20"
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="shrink-0"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}

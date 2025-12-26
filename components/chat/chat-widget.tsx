"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatPanel } from "./chat-panel"

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="hidden sm:flex border-primary/20 hover:bg-primary/5 hover:text-primary gap-2 transition-all duration-300 ease-in-out"
                aria-label="Open AI Assistant"
                aria-expanded={isOpen}
                aria-controls="ai-assistant-panel"
                role="button"
            >
                <span className="text-lg" aria-hidden="true">✨</span>
                <span className="font-medium">AI Assistant</span>
            </Button>

            {/* Button for Mobile (responsive handling fallback if header hides it) 
          The header layout in dashboard-header seems to hide the button on mobile ('hidden sm:flex'). 
          I will stick to the header replacement constraint, but if a mobile trigger is needed, it should be added to the mobile menu.
          For now, this matches the replaced 'AI Assistant' button structure exactly.
      */}

            <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

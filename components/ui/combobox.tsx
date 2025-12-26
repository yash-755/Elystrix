"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
    label: string
    value: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    onSelect: (value: string) => void
    allowCustom?: boolean
    onCreateCustom?: (value: string) => void
    className?: string
}

export function Combobox({
    options,
    value,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    onSelect,
    allowCustom = false,
    onCreateCustom,
    className,
    disabled = false
}: ComboboxProps & { disabled?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const selectedLabel = options.find(opt => opt.value === value)?.label || value

    const handleSelect = (currentValue: string) => {
        onSelect(currentValue)
        setOpen(false)
    }

    const handleCustomCreate = () => {
        if (onCreateCustom && searchQuery) {
            onCreateCustom(searchQuery)
            onSelect(searchQuery)
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between disabled:opacity-50 disabled:cursor-not-allowed", className)}
                >
                    {value ? <span className="text-foreground">{selectedLabel}</span> : <span className="text-muted-foreground">{placeholder}</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={setSearchQuery} />
                    <CommandList>
                        <CommandEmpty>
                            {allowCustom && searchQuery ? (
                                <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-sm" onClick={handleCustomCreate}>
                                    <Plus className="w-4 h-4" />
                                    <span>Create "{searchQuery}"</span>
                                </div>
                            ) : (
                                emptyText
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // Use label for searching
                                    onSelect={(currentValue) => {
                                        // shadcn command returns lowercase label usually
                                        // we find the original option
                                        const selectedOption = options.find(o => o.label.toLowerCase() === currentValue.toLowerCase())
                                        handleSelect(selectedOption ? selectedOption.value : currentValue)
                                    }}
                                    className={cn(
                                        "cursor-pointer",
                                        value === option.value && "bg-primary/10 text-primary font-medium"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

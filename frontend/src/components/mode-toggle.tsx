"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
// No DropdownMenu yet, so just a toggle button for now or simple cycle
// Let's make a simple cycle button for MVP or utilize state to show options? 
// A single button toggle is easiest for now: Sun -> Moon -> System (maybe just Sun/Moon)

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

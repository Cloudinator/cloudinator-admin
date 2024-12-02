"use client"

import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { PanelLeftClose, PanelRightClose } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"



interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)


    return (
        <div
            className={cn(
                "relative flex flex-col h-screen bg-background transition-all duration-300 border-r",
                isCollapsed ? "w-[80px]" : "w-64",
                className
            )}
        >
            <div className="flex items-center justify-between p-4">
                {!isCollapsed && <h2 className="text-lg font-semibold">Shadcn Admin</h2>}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <PanelRightClose className="h-5 w-5" />
                    ) : (
                        <PanelLeftClose className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <div className="flex-1 overflow-auto">
                <MainNav isCollapsed={isCollapsed} />
            </div>
            <div className="p-4 flex justify-center">
                <ThemeToggle />
            </div>
        </div>
    )
}


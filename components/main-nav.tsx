"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Cog, LayoutDashboard, MessageSquare, Plus, Users } from 'lucide-react';

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
};

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspaces", href: "/workspace", icon: Plus, badge: "3" },
    { title: "Backup", href: "/backup", icon: MessageSquare, badge: "8" },
    { title: "Domain", href: "/domain", icon: Box },
    { title: "Users", href: "/users", icon: Users },
    { title: "Settings", href: "/account", icon: Cog },
];

interface MainNavProps {
    isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col gap-2 p-2">
                {navItems.map((item, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-primary hover:text-primary-foreground",
                                    isCollapsed ? "justify-center" : "justify-start"
                                )}
                            >
                                <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-grow">{item.title}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" className="flex items-center gap-4">
                                {item.title}
                                {item.badge && (
                                    <Badge variant="secondary">{item.badge}</Badge>
                                )}
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    );
}

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
import { useGetAllWorkSpacesQuery } from "@/redux/api/projectApi";
import { useGetAllUserProfileQuery } from "@/redux/api/userApi";

type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badge2?: string;
};

type Workspace = {
    uuid: string;
    name: string;
    isActive: boolean;
};

type Workspaces = Workspace[];

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspace", href: "/workspace", icon: Plus, badge: "-" },
    { title: "Backup", href: "/backup", icon: MessageSquare },
    { title: "Domain", href: "/domain", icon: Box },
    { title: "Users", href: "/users", icon: Users, badge2: "-" },
    { title: "Settings", href: "/account", icon: Cog },
];

interface MainNavProps {
    isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
    const pathname = usePathname();

    const { data: workspaces } = useGetAllWorkSpacesQuery() as {
        data: Workspaces | undefined;
        isLoading: boolean;
        isError: boolean;
        refetch: () => void;
    };
    const totalWorkspaces = workspaces?.length || 0;

    const { data: users = [] } = useGetAllUserProfileQuery();
    const totalUsers = users.length || 0;

    // Update the navItems with dynamic badge2 value
    const updatedNavItems = navItems.map((item) => {
        if (item.title === "Users") {
            return {
                ...item,
                badge2: totalUsers.toString(), // Set badge2 to the total number of users
            };
        }
        return item;
    });

    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col gap-2 p-2">
                {updatedNavItems.map((item, index) => (
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
                                                {totalWorkspaces}
                                            </Badge>
                                        )}
                                        {item.badge2 && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge2}
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
                                    <Badge variant="secondary">{totalWorkspaces}</Badge>
                                )}
                                {item.badge2 && (
                                    <Badge variant="secondary">{item.badge2}</Badge>
                                )}
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    );
}

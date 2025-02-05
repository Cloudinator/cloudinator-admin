"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard, MessageSquare, Plus, Users} from 'lucide-react';

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllWorkSpacesQuery, useGetBuildHistoryQuery } from "@/redux/api/projectApi";
import { useGetAllUserProfileQuery } from "@/redux/api/userApi";
import { BuildHistoryResponse } from "./dashboard/DashboardComponent";

type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badge2?: string;
    badge3?: string | React.ReactNode; // Allow badge3 to be a string or React node
};

type Workspace = {
    uuid: string;
    name: string;
    isActive: boolean;
};

type Workspaces = Workspace[];

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge3: "-" },
    { title: "Workspace", href: "/workspace", icon: Plus, badge: "-" },
    { title: "Monitoring", href: "/monitoring", icon: MessageSquare },
    // { title: "Domain", href: "/domain", icon: Box },
    { title: "Users", href: "/users", icon: Users, badge2: "-" },
    // { title: "Settings", href: "/account", icon: Cog },
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

    const { data: buildHistory, isLoading: isBuildHistoryLoading } = useGetBuildHistoryQuery() as {
        data: BuildHistoryResponse | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    // Handle badge3 for recent deployments
    const badge3Content = isBuildHistoryLoading || !buildHistory ? (
        <div className="flex items-center gap-1">
            <span className="animate-pulse">...</span> {/* Loading indicator */}
        </div>
    ) : (
        buildHistory.length.toString() // Show the number of recent deployments
    );

    // Update the navItems with dynamic badge values
    const updatedNavItems = navItems.map((item) => {
        if (item.title === "Users") {
            return {
                ...item,
                badge2: totalUsers.toString(), // Set badge2 to the total number of users
            };
        }
        if (item.title === "Dashboard") {
            return {
                ...item,
                badge3: badge3Content, // Set badge3 to the loading indicator, "Building...", or the number of recent deployments
            };
        }
        if (item.title === "Workspace") {
            return {
                ...item,
                badge: totalWorkspaces.toString(), // Set badge to the total number of workspaces
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
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {item.badge2 && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge2}
                                            </Badge>
                                        )}
                                        {item.badge3 && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge3}
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
                                {item.badge2 && (
                                    <Badge variant="secondary">{item.badge2}</Badge>
                                )}
                                {item.badge3 && (
                                    <Badge variant="secondary">{item.badge3}</Badge>
                                )}
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    );
}
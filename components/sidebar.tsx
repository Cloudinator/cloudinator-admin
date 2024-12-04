"use client";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <main>
      <section className="sticky top-0">
        <div
          className={cn(
            "relative flex flex-col h-screen bg-background transition-all duration-300 border-r",
            isCollapsed ? "w-[80px]" : "w-64",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && <h2 className="text-lg font-semibold">Admin Dashboard</h2>}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleCollapse}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto">
            <MainNav isCollapsed={isCollapsed} />
          </div>

          {/* Footer */}
          <div className="p-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </section>
    </main>
  );
}

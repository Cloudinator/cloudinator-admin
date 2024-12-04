"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering (to avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center gap-2 h-10 w-auto px-4"
      aria-label="Toggle Theme"
    >
      {/* Icon container to keep the Sun and Moon aligned */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <Sun
          className={`absolute transition-transform ${
            theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute transition-transform ${
            theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
    </Button>
  );
}

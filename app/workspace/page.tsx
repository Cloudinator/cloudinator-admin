"use client";

import { WorkspaceManagement } from "@/components/workspace/workspace-management";

export default function WorkspacesPage() {
  return (
    <div
      className="flex-1 space-y-6 p-8 min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)",
      }}
    >
      {/* Glassmorphism Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className="p-8 rounded-lg border border-gray-200 dark:border-white/10 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 shadow-lg hover:shadow-purple-500/20 transition-shadow"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)",
          }}
        >
          <WorkspaceManagement />
        </div>
      </div>
    </div>
  );
}

"use client";

import UserDataWrapper from "@/components/dashboard/UserDataWrapper";
import { WorkspaceManagement } from "@/components/workspace/workspace-management";

export default function WorkspacesPage() {
  return (
    <section
      className="min-h-screen w-full p-8 bg-white dark:bg-gray-900 transition-colors duration-300"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Particle Animation Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='a' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Ccircle cx='600' cy='400' r='200' fill='%23000' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          animation: "moveParticles 20s linear infinite",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="p-6 rounded-lg border border-gray-200 dark:border-white/10 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 shadow-lg">
          <UserDataWrapper>
            <WorkspaceManagement />
          </UserDataWrapper>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
            @keyframes moveParticles {
              0% {
                transform: translateY(0) translateX(0);
              }
              50% {
                transform: translateY(-10%) translateX(-10%);
              }
              100% {
                transform: translateY(0) translateX(0);
              }
            }
          `}</style>
    </section>
  );
}

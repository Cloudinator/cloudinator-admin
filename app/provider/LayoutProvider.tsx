"use client"; // Use client directive for client-side rendering

import { createContext, useContext, ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface LayoutContextProps {
  // Add any layout-related props here
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutContext.Provider value={{}}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </LayoutContext.Provider>
  );
};

// Custom hook to access layout context if needed
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

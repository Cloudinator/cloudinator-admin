"use client"; // Use client directive for client-side rendering

import { createContext, useContext, ReactNode } from "react";
import { ThemeProvider } from "next-themes";

// Define the type for the context value
// Use an empty object type or define properties if needed
type LayoutContextProps = Record<string, never>; // An empty object type

// Create the context with an appropriate default value
const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

// LayoutProvider component props
interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  // Initialize context value
  const layoutContextValue: LayoutContextProps = {}; // Empty object as the context value

  return (
    <LayoutContext.Provider value={layoutContextValue}>
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

// Custom hook to use the LayoutContext
export const useLayout = (): LayoutContextProps => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

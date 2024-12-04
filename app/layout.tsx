import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {Sidebar} from "@/components/sidebar";
import { Poppins } from "next/font/google"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Choose the weights you need
  variable: "--font-poppins", // CSS variable name for Poppins
});

export const metadata: Metadata = {
  title: "Cloudinator",
  description: "Cloudinator is a comprehensive platform for deploying frontend, backend, databases, and creating and managing microservices seamlessly. Empower your development with efficient, scalable, and modern deployment solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
      >
        <main className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </main>
      </ThemeProvider>
      </body>
    </html>
  );
}

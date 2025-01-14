import { LayoutProvider } from "./provider/LayoutProvider";
import { Sidebar } from "@/components/sidebar";
import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import UserDataWrapper from "@/components/dashboard/UserDataWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Cloudinator",
  description:
    "Cloudinator is a comprehensive platform for deploying frontend, backend, databases, and creating and managing microservices seamlessly. Empower your development with efficient, scalable, and modern deployment solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <StoreProvider>
          <LayoutProvider>
            <UserDataWrapper>
              <main className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 overflow-y-auto">
                  {children}
                  <Toaster />
                </div>
              </main>
            </UserDataWrapper>
          </LayoutProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

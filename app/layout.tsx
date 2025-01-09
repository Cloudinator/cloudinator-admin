import { LayoutProvider } from "./provider/LayoutProvider";
import { Sidebar } from "@/components/sidebar";
import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <LayoutProvider>
          <StoreProvider>
            <div className="flex min-h-screen">
              <Sidebar/>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </StoreProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}

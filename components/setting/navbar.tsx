'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the type for navigation links
type Navigation = {
  label: string;
  path: string;
};

const Navbar: React.FC = () => {
  const pathname = usePathname(); // Get the current path

  // Explicitly type the links array
  const links: Navigation[] = [
    { label: "Account", path: "/account" },
    { label: "Notifications", path: "/notifications" },
    { label: "Billing", path: "/billing" },
    { label: "Teams", path: "/teams" },
    { label: "Integrations", path: "/integrations" },
  ];

  return (
    <section className="w-full py-4 flex border-b bg-white dark:bg-black">
      <div className="ml-8">
        <nav className="flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium ${
                pathname === link.path ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default Navbar;

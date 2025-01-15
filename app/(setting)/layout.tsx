import React, { ReactNode } from "react";
import Navbar from "@/components/setting/navbar";
import UserDataWrapper from "@/components/dashboard/UserDataWrapper";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserDataWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
      </div>
    </UserDataWrapper>
  );
};

export default Layout;

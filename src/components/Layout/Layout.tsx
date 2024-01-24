import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (  
        <main>
            <Navbar />
            {children}
        </main>
    );
};

export default Layout;

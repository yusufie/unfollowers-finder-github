import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (  
        <main className="flex flex-col items-center h-screen py-8 gap-8" >
            <Navbar />
            {children}
            <Footer />
        </main>
    );
};

export default Layout;

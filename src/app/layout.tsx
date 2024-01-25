import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unfollowers Finder",
  description: "Find your unfollowers on GitHub",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}

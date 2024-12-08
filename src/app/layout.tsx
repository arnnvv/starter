import "./globals.css";
import type { Metadata } from "next";
import { JSX, ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Starter Kit",
  description: "Generated by Arnav for Arnav",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Navbar />
        {children}
        <Toaster richColors={true} />
      </body>
    </html>
  );
}

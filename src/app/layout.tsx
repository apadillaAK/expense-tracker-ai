import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Spendwise · Expense Tracker", template: "%s · Spendwise" },
  description: "Track, filter, and analyze your personal expenses.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
